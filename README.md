# Activity Tracking Slash Command App for Slack

This is a sample project for a simple slash command to track your activities as a team on Slack. The app lets a user to type `/running` and/or `/biking` slash command to record the activity, as well as showing the leaderboards and most active acitivities for each user as a public slack message.

![HTTP Status Cats for Slack](https://github.com/girliemac/slack-httpstatuscats/blob/master/public/images/slack-httpstatuscats.gif)
![alt text](https://github.com/ozencelik/10lift-slackbot/blob/main/public/Screenshot_1.png)

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
    * Request URL: [https://f62b621797bb.ngrok.io]
    * Short description: `Track your running time !`
    * Usage hint: `[ur running time in minute]`
3. Save


