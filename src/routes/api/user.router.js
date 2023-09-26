const { Router } = require('express')
const userManager = require('../../managers/user.manager')

const router = Router()
//creo o actualizo usuario
router.post('/', async (req, res) => {
    const user =  req.body
    console.log(user)
    const existing = await userManager.getUserByUsername(user.user)

    console.log(existing)
    if (!existing) {
        
        const created = await userManager.add(user)
        res.send(created)
        return
    }
    
    const update = await userManager.update(existing._id,user)
    res.send(user)

})
//obtengo usuario por id
router.get('/:uid', async (req, res)=> {
    const uid = req.params.uid
    const existing = await userManager.getById(uid)
    console.log(existing)
    if (!existing || existing == null) {
        res.status(404).json({ error: `The user with the id ${uid} was not found` })
        return
    }
    res.send(existing)
    
})

module.exports = router
