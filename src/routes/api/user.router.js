const { Router } = require('express')
const userManager = require('../../dao/managers/user.manager')

const router = Router()

router.post('/', async (req, res) => {
    const user =  req.body
    console.log(user)
    const existing = await userManager.getUserByUsername(user.user)

    console.log(existing)
    if (!existing) {
        
        const created = await userManager.addUser(user)
        res.send(created)
        return
    }
    res.status(404).json({ error: `User ${user.user} alredy exists` })
    

})

router.get('/:uid', async (req, res)=> {
    const uid = req.params.uid
    const existing = await userManager.getUserById(uid)
    console.log('existing')

    console.log(existing)
    if (!existing || existing == null) {
        console.log('entró')
        res.status(404).json({ error: `The user with the id ${uid} was not found` })
        return
    }
    res.send(existing)
    
})

module.exports = router
