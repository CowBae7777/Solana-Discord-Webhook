const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.use(express.json());

// Discord Webhook URL
const discordWebhookUrl = "YOUR_DISCORD_WEBHOOK_URL";

// 指定的 Mint Address
const targetMintAddress = "TOKEN MINT ADDRESS";

// 提取交易信息
function getTransactionDetails(transaction) {
    const tokenTransfers = transaction.tokenTransfers || [];
    let targetTokenAmount = null;

    // 檢查是否存在包含指定 mint 地址的 Token 轉移，並提取 tokenAmount
    tokenTransfers.forEach(transfer => {
        if (transfer.mint === targetMintAddress) {
            targetTokenAmount = transfer.tokenAmount;
        }
    });

    // 如果找到符合的 mint address，回傳交易詳細信息
    if (targetTokenAmount !== null) {
        return {
            actionType: 'Buy ',
            solTransfers: transaction.nativeTransfers || [],
            signature: transaction.signature,
            slot: transaction.slot,
            targetTokenAmount: targetTokenAmount // 添加 tokenAmount
        };
    } else {
        return null; // 如果沒有符合條件的 mint address，返回 null
    }
}

// 發送交易信息到 Discord
async function sendToDiscord(transactionDetails) {
    const solscanUrl = `https://solscan.io/tx/${transactionDetails.signature}`;
    const gmgnUrl = `https://gmgn.ai/sol/address/${transactionDetails.solTransfers[0].fromUserAccount}`;

    let messageContent = `release v1.0 \n\n區塊: ${transactionDetails.slot}\n\n`;

    // 添加購買 SOL 和對應獲得的代幣數量
    const solTransfers = transactionDetails.solTransfers || [];
    solTransfers.forEach((transfer, index) => {
        const solAmount = (transfer.amount / 1000000000).toFixed(3); // SOL 轉換
        messageContent += `Trade Log :\n`;
        messageContent += `- 購買金額: ${solAmount} SOL\n`;
        messageContent += `- 獲得數量: ${transactionDetails.targetTokenAmount} 顆 $MINT-TOKEN-NAME\n\n`;
    });

    // 添加更多鏈接信息
    messageContent += `Solana explorer [Solscan txn](${solscanUrl})\n`;
    messageContent += `GMGN [address](${gmgnUrl})\n`;

    const message = { content: messageContent };

    try {
        const response = await axios.post(discordWebhookUrl, message);
        console.log('成功將消息發送到 Discord: ', response.status);
    } catch (error) {
        console.error('發送到 Discord 失敗: ', error.response ? error.response.data : error.message);
        throw new Error('發送到 Discord 失敗');
    }
}

app.post('/webhook', async (req, res) => {
    const transactionData = req.body[0];

    console.log("Helius Websocket send -->: ", JSON.stringify(transactionData, null, 2));

    try {
        const transactionDetails = getTransactionDetails(transactionData);

        if (transactionDetails) {
            await sendToDiscord(transactionDetails);
        }
        res.status(200).send({ body: "Webhook received and processed!" });
    } catch (error) {
        console.error('Webhook Error: ', error.message);
        res.status(500).send({ error: "Failed to process webhook" });
    }
});

app.listen(PORT, () => {
    console.log(`Starting： ${PORT}`);
});
