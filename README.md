# Activity Tracking Slash Command App for Slack

This is a sample project for a simple slash command to track your activities as a team on Slack. The app lets a user to type `/running` and/or `/biking` slash command to record the activity, as well as showing the leaderboards with `/leaderboard` command and most active acitivities for each user with `/mostactiveacitiviesofusers` command as a public slack message.

## Sample messages

### 1. Save your `/running` time 
---
![alt text](https://github.com/ozencelik/10lift-slackbot/blob/main/public/Screenshot_2.png)

### 2. List Leaderboard 
---
![alt text](https://github.com/ozencelik/10lift-slackbot/blob/main/public/Screenshot_1.png)

### 3. List Most Active Users 
---
![alt text](https://github.com/ozencelik/10lift-slackbot/blob/main/public/Screenshot_8.png)

### 4. We kindly warn you if something goes wrong :) 
---
![alt text](https://github.com/ozencelik/10lift-slackbot/blob/main/public/Screenshot_3.png) 

![alt text](https://github.com/ozencelik/10lift-slackbot/blob/main/public/Screenshot_4.png)


---

## Build your own - Developer setup

### Create a Slack app

1. Create a *workspace app* at [https://api.slack.com/apps?new_app_token=1](https://api.slack.com/apps?new_app_token=1)
2. Add a Slash command (See *Add a Slash Command* section below)
3. Navigate to the **OAuth & Permissions** page, scroll down to **Scopes** section, and make sure the `commands` scope is added.
4. Go to **Install Apps** and intall the app to the selected workspace. (You should get an Verification token after the installation)
5. In the mean time, go to **Basic Information** to set up your app info and get your credentials. (You will need the credentials to run the app. See the *Run the app locally* below.)

#### Add a Slash Command
1. Go back to the app settings and click on Slash Commands.
2. Click the 'Create New Command' button and fill in the following:
    * Command: `/running`
    * Request URL: [Will be provided by Özenç]
    * Short description: `Track your running time !`
    * Usage hint: `[ur running time in minute]`
3. Save
4. Sample screenshot 
---
![alt text](https://github.com/ozencelik/10lift-slackbot/blob/main/public/Screenshot_6.png)


