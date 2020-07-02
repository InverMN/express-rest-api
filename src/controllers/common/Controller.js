import express from 'express'
const { Router } = express
import { handleError } from './index.js'

export class Controller {
	constructor() {
		this.router = new Router()
	}

	get(path, first, second) {
		let callback = second === undefined ? first : second

		let action = async (req, res) => {
			try {
				await callback(req, res)
			} catch (error) {
				handleError(res, error)
			}
		}

		second === undefined ? this.router.get(path, action) : this.router.get(path, first, action)
	}

	post(path, first, second) {
		let callback = second === undefined ? first : second

		let action = async (req, res) => {
			try {
				await callback(req, res)
			} catch (error) {
				handleError(res, error)
			}
		}

		second === undefined ? this.router.post(path, action) : this.router.post(path, first, action)
	}

	delete(path, first, second) {
		let callback = second === undefined ? first : second

		let action = async (req, res) => {
			try {
				await callback(req, res)
			} catch (error) {
				handleError(res, error)
			}
		}

		second === undefined ? this.router.delete(path, action) : this.router.delete(path, first, action)
	}

	patch(path, first, second) {
		let callback = second === undefined ? first : second

		let action = async (req, res) => {
			try {
				await callback(req, res)
			} catch (error) {
				handleError(res, error)
			}
		}

		second === undefined ? this.router.patch(path, action) : this.router.patch(path, first, action)
	}
}