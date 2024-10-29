const axios = require('axios');

// 發送交易數據到 Discord Webhook
async function sendToDiscord(transactionData) {
    const discordWebhookUrl = "YOUR_DISCORD_WEBHOOK_URL";
    const message = {
        content: `收到新的交易通知: ${JSON.stringify(transactionData, null, 2)}`
    };

    try {
        // 發送 POST 請求到 Discord Webhook
        const response = await axios.post(discordWebhookUrl, message);
        console.log('成功將消息發送到 Discord: ', response.status);
    } catch (error) {
        // 更詳細的錯誤處理
        console.error('發送到 Discord 失敗: ', error.response ? error.response.data : error.message);
        throw new Error('發送到 Discord 失敗');
    }
}

module.exports = sendToDiscord;
