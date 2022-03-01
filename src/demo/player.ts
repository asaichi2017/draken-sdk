import draken from '../sdk'
import { config, contentID } from './env'

draken.configure(config)

const player = draken.player('video')
player.load(contentID)
