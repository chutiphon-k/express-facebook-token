import express from 'express'
import bodyParser from 'body-parser'
import nodeNotifier from 'node-notifier'
import errorhandler from 'errorhandler'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import passport from 'passport'
import { Strategy } from 'passport-facebook'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'

import routes from 'routes'

const app = express()

if (process.env.NODE_ENV === 'development') {
	app.use(errorhandler({log: errorNotification}))
}

function errorNotification (err, str, req) {
	if (err) {
		let title = 'Error in ' + req.method + ' ' + req.url

		nodeNotifier.notify({
			title: title,
			message: str
		})
	}
}

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())
app.use(cors())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())
// app.use('/', routes)

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

app.get('/', (req, res) => {
	res.render('home', { user: req.user })
})

app.get('/login', (req, res) => {
	res.render('login')
})

app.get('/login/facebook', passport.authenticate('facebook'))

app.get('/login/facebook/return', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
	res.redirect('/')
})

app.get('/profile', (req, res) => {
	res.render('profile', { user: req.user })
})

export default app
