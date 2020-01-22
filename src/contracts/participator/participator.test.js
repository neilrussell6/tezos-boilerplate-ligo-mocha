const chai = require ('chai')
const chaiAsPromised = require('chai-as-promised')

const { contract } = require('../../common/test.utils')

chai.use(chaiAsPromised)

const { assert } = chai

const ownerAddress = 'tz1bVNHSrD3sneJXQToWzzJ72eNmon2FH1D9'
const user1Address = 'tz1fxvhgsbRxYKQ4gZ8U3LY1DHxdByjwzdHW'
const user2Address = 'tz1W4W2yFAHz7iGyQvFys4K7Df9mZL6cSKCp'

describe('participator', () => {
  describe('compile', () => {
    it('should successfully compile', async () => {
      const instance = contract('participator/participator')
      const result = await instance.compile()
      assert.isNotNull(result)
    })
  })

  describe('addParticipant', () => {
    it('should allow owner to add participant with initial amount', async () => {
      // given ... a Participator contract instance with owner set
      const storage = `record participants = map ("${user1Address}": address) -> record name = "ONE"; balance = 5mutez; end; end; owner = ("${ownerAddress}": address) end`
      const instance = contract('participator/participator', storage)

      // when
      // ... we add a participant as the owner
      const name = 'TWO'
      const params = `AddParticipant(record address = ("${user2Address}": address); name = "${name}"; end)`
      const amountMutez = 3
      const amountTez = amountMutez / 1000000
      const config = {
        sender: ownerAddress,
        amount: amountTez,
      }
      const result = await instance.call(params, config)

      // then
      // ... should succeed
      // ... adding the participant
      // ... with the provided amount as their initial value
      const expected = `( [] , {participants = big_map[ address "${user1Address}" -> {name = "ONE" , balance = 5mutez} ; address "${user2Address}" -> {name = "${name}" , balance = ${amountMutez}mutez} ] , owner = address "${ownerAddress}"} )`
      assert.equal(result, expected)
    })

    it('should not allow adding duplicate participants', async () => {
      // given
      // ... a Participator contract instance with owner set
      // ... that already has a participant
      const storage = `record participants = map ("${user1Address}": address) -> record name = "ONE"; balance = 5mutez; end; end; owner = ("${ownerAddress}": address) end`
      const instance = contract('participator/participator', storage)

      // when
      // ... we attempt to re-add an existing participant as the owner
      const params = `AddParticipant(record address = ("${user1Address}": address); name = "ONE"; end)`
      const config = {
        sender: ownerAddress,
        amount: 0,
      }

      // then
      // ... should fail
      await assert.isRejected(
        instance.call(params, config),
        Error,
        'ERROR_CANNOT_ADD_DUPLICATE_PARTICIPANT',
      )
    })

    it('should not allow non-owner to add participant', async () => {
      // given ... a Participator contract instance with owner set
      const storage = `record participants = map ("${user1Address}": address) -> record name = "ONE"; balance = 5mutez; end; end; owner = ("${ownerAddress}": address) end`
      const instance = contract('participator/participator', storage)

      // when
      // ... we attempt to add a participant as not the owner
      const params = `AddParticipant(record address = ("${user1Address}": address); name = "ONE"; end)`
      const config = {
        sender: user1Address,
        amount: 0,
      }

      // then
      // ... should fail
      // ... not adding participant
      await assert.isRejected(
        instance.call(params, config),
        Error,
        'ERROR_ONLY_OWNER_CAN_ADD_PARTICIPANT',
      )
    })
  })

  describe('participate', () => {
    it('should allow participants to participate, incrementing their value', async () => {
      // given
      // ... a Participator contract instance with owner set
      // ... that already has a participant
      const user1InitialBalance = 5
      const storage = `record participants = map ("${user1Address}": address) -> record name = "ONE"; balance = ${user1InitialBalance}mutez; end; end; owner = ("${ownerAddress}": address) end`
      const instance = contract('participator/participator', storage)

      // when
      // ... we participate as a registered participant
      const params = 'Participate(Unit)'
      const amountMutez = 3
      const amountTez = amountMutez / 1000000
      const config = {
        sender: user1Address,
        amount: amountTez,
      }
      const result = await instance.call(params, config)

      // then
      // ... should succeed
      // ... incrementing our participant value
      const expectedBalance = user1InitialBalance + amountMutez
      const expected = `( [] , {participants = big_map[ address "${user1Address}" -> {name = "ONE" , balance = ${expectedBalance}mutez} ] , owner = address "${ownerAddress}"} )`
      assert.equal(result, expected)
    })

    it('should not allow unregistered user to participate', async () => {
      // given
      // ... a Participator contract instance with owner set
      // ... that already has a participant
      const storage = `record participants = map ("${user1Address}": address) -> record name = "ONE"; balance = 5mutez; end; end; owner = ("${ownerAddress}": address) end`
      const instance = contract('participator/participator', storage)

      // when
      // ... we attempt to participate as a unregistered participant
      const params = 'Participate(Unit)'
      const config = {
        sender: user2Address,
        amount: 0.000003,
      }
      // then ... should fail
      await assert.isRejected(
        instance.call(params, config),
        Error,
        'ERROR_ONLY_REGISTERED_PARTICIPANTS_CAN_PARTICIPATE',
      )
    })
  })
})
