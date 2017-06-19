import { Router } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-facebook'

const router = Router()

passport.use(new Strategy({
	clientID: '1559210274103122',
	clientSecret: '4a0a4715b7bd94d12b3409c6ce872bb3',
	callbackURL: 'http://localhost:3000/login/facebook/return'
}, (accessToken, refreshToken, profile, cb) => {
	cb(null, profile)
}))

passport.serializeUser((user, cb) => {
	cb(null, user)
})

passport.deserializeUser((obj, cb) => {
	cb(null, obj)
})

router.get('/', (req, res) => {
	res.render('home', { user: req.user })
})

router.get('/login', (req, res) => {
	res.render('login')
})

router.get('/login/facebook', passport.authenticate('facebook'))

router.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
	res.redirect('/')
})

router.get('/profile', (req, res) => {
	res.render('profile', { user: req.user })
})

export default router
