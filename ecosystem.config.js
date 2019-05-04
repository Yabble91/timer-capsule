module.exports = {
  "app": [
    {
      "name": "timer",
      "script": "./bin/www",
      "output": "/www/log_bin/timerCapsule/out.log",
      "error": "/www/log_bin/timerCapsule/err.log",
      "env": {
        "COMMON_VARIABLE": "true"
      },
      "env_production": {
        "NODE_ENV": "production"
      }
    }
  ],
  "deploy": {
    "aliTimerCapsule": {
      "user": "root",
      "host": ["47.93.15.178"],
      "ref": "origin/master",
      "repo": "https://github.com/Yubble/timer-capsule.git",
      "path": "/www/website/timerCapsule",
      "ssh_options": "StrictHostKeyChecking=no",
      "post-deploy":"yarn install && yarn prd",
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}

// # Setup deployment at remote location
// pm2 deploy production setup

// # Update remote version
// pm2 deploy production update

// # Revert to -1 deployment
// pm2 deploy production revert 1

// # execute a command on remote servers
// pm2 deploy production exec "pm2 reload all"