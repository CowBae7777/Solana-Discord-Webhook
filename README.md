# Solana-Helius-Discord-Webhook

## What is This ? What can it do ?

You can setup your Discord Channel Webhook, \
to follow smart money address in your Discord Channel. \
will to address transactions to the Blockchain. \
your Discord Channel will be notified. 

## What Should I Do First ?
1. [X] Sign up Helius Account! [Helius-official-website](https://dashboard.helius.dev/)
![Sign_up.png](img/Sign_up.png)
2. [X] Choose your plan (You can Choose Free Plan to Practice)
![Choose_plan.png](img/Choose_plan.png)
3. [X] Download Ngrok and Setup it [Ngrok-official-website](https://ngrok.com/)
![Ngrok_setup.png](img/Ngrok_setup.png)


### Setup Discord webhook
1. [X] Create a Discord Channel
![Create_discord_channel.png](img/Create_discord_channel.png)
2. [X] Setup Webhook and Copy Webhook URL
![Setup_discord_webhook.png](img/Setup_discord_webhook.png)
3. [X] Paste Discord Webhook URL to app.js & discord.js
![paste_to_app_js.png](img/paste_to_app_js.png)
![Paste_to_discord_js.png](img/Paste_to_discord_js.png)

### Setup Helius
1. [X] Setup Helius Websocket URL and Smart Money Address
![Seeting_Websocket.png](img/Seeting_Websocket.png)

### Total setup

```git clone https://github.com/kiwiiiii-eth/Solana-Helius-Discord-Webhook.git``` \
```cd Solana-Helius-Discord-Webhook``` \
```npm install express axios app port``` \
```node app.js``` \
```ngrok http 3000```

### Copy Ngrok URL and Paste it to Helius Websocket URL
![ngrok_run.png](img/ngrok_run.png)
### success !!
![successful.png](img/successful.png)