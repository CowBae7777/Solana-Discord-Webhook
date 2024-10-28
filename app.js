// const express = require('express');
// const axios = require('axios');
// const app = express();
// const PORT = 3000;
//
// // 解析 JSON 請求體
// app.use(express.json());
//
// // Discord Webhook URL
// const discordWebhookUrl = "https://discord.com/api/webhooks/1299308318396780627/DKCrCbSzfnMpeR-3fs3zh8oMvmeHQiXHPq-B7kSCLCMDcfVcrXnA5sK7HcJxk9owAyeY";
//
// // 發送交易數據到 Discord
// async function sendToDiscord(transactionData) {
//     // 提取關鍵交易資訊
//     const nativeTransfers = transactionData.nativeTransfers || [];
//     const transferDetails = nativeTransfers.map((transfer, index) => {
//         return `轉帳 ${index + 1}:
//         - 轉帳者: ${transfer.fromUserAccount}
//         - 接收者: ${transfer.toUserAccount}
//         - 金額: ${(transfer.amount / 1000000000).toFixed(9)} SOL`;
//     }).join('\n');
//
//     // 构建要发送到 Discord 的消息
//     const message = {
//         content: `交易通知:
//         簽名: ${transactionData.signature}
//         槽位: ${transactionData.slot}
//         手續費: ${(transactionData.fee / 1000000000).toFixed(9)} SOL
//         ${transferDetails}`
//     };
//
//     try {
//         // 發送 POST 請求到 Discord Webhook
//         const response = await axios.post(discordWebhookUrl, message);
//         console.log('成功將消息發送到 Discord: ', response.status);
//     } catch (error) {
//         console.error('發送到 Discord 失敗: ', error.response ? error.response.data : error.message);
//         throw new Error('發送到 Discord 失敗');
//     }
// }
//
// // 接收 Helius Webhook 的 POST 請求
// app.post('/webhook', async (req, res) => {
//     const transactionData = req.body[0];  // Webhook 發送的數據是數組，提取第一個元素
//
//     console.log("收到 Helius Webhook 通知: ", JSON.stringify(transactionData, null, 2));
//
//     try {
//         // 將交易數據發送到 Discord
//         await sendToDiscord(transactionData);
//         res.status(200).send({ body: "Webhook received and processed!" });
//     } catch (error) {
//         console.error('處理 Webhook 時發生錯誤: ', error.message);
//         res.status(500).send({ error: "Failed to process webhook" });
//     }
// });
//
// // 啟動伺服器
// app.listen(PORT, () => {
//     console.log(`伺服器運行中！端口: ${PORT}`);
// });

// const express = require('express');
// const axios = require('axios');
// const app = express();
// const PORT = 3000;
//
// // 解析 JSON 請求體
// app.use(express.json());
//
// // Discord Webhook URL
// const discordWebhookUrl = "https://discord.com/api/webhooks/1299308318396780627/DKCrCbSzfnMpeR-3fs3zh8oMvmeHQiXHPq-B7kSCLCMDcfVcrXnA5sK7HcJxk9owAyeY";
//
// // 判斷交易類型並提取核心資訊
// function getTransactionDetails(transaction) {
//     const nativeTransfers = transaction.nativeTransfers || [];
//     const tokenTransfers = transaction.tokenTransfers || [];
//
//     let actionType = '未知操作';
//     let solAmount = 0;
//     let tokenAmount = 0;
//     let tokenMint = '';
//
//     // 檢查 nativeTransfers 判斷是否涉及 SOL
//     nativeTransfers.forEach(transfer => {
//         if (transfer.fromUserAccount === transaction.feePayer) {
//             solAmount = -(transfer.amount / 1000000000);  // 減少代表購買
//             actionType = '購買';
//         } else if (transfer.toUserAccount === transaction.feePayer) {
//             solAmount = transfer.amount / 1000000000;  // 增加代表出售
//             actionType = '出售';
//         }
//     });
//
//     // 檢查 tokenTransfers 判斷是否涉及 SPL 代幣
//     if (tokenTransfers.length > 0) {
//         tokenAmount = tokenTransfers[0].tokenAmount.uiAmount;
//         tokenMint = tokenTransfers[0].mint;
//     }
//
//     return {
//         actionType,
//         solAmount,
//         tokenAmount,
//         tokenMint,
//         signature: transaction.signature,
//         slot: transaction.slot
//     };
// }
//
// // 發送簡化交易資訊到 Discord
// async function sendToDiscord(transactionDetails) {
//     const message = {
//         content: `交易通知:
//         操作類型: ${transactionDetails.actionType}
//         簽名: ${transactionDetails.signature}
//         槽位: ${transactionDetails.slot}
//         SOL 金額: ${transactionDetails.solAmount} SOL
//         代幣數量: ${transactionDetails.tokenAmount} (${transactionDetails.tokenMint})`
//     };
//
//     try {
//         const response = await axios.post(discordWebhookUrl, message);
//         console.log('成功將消息發送到 Discord: ', response.status);
//     } catch (error) {
//         console.error('發送到 Discord 失敗: ', error.response ? error.response.data : error.message);
//         throw new Error('發送到 Discord 失敗');
//     }
// }
//
// // 接收 Helius Webhook 的 POST 請求
// app.post('/webhook', async (req, res) => {
//     const transactionData = req.body[0];
//
//     console.log("收到 Helius Webhook 通知: ", JSON.stringify(transactionData, null, 2));
//
//     try {
//         // 提取並判斷交易類型
//         const transactionDetails = getTransactionDetails(transactionData);
//
//         // 發送到 Discord
//         await sendToDiscord(transactionDetails);
//         res.status(200).send({ body: "Webhook received and processed!" });
//     } catch (error) {
//         console.error('處理 Webhook 時發生錯誤: ', error.message);
//         res.status(500).send({ error: "Failed to process webhook" });
//     }
// });
//
// // 啟動伺服器
// app.listen(PORT, () => {
//     console.log(`伺服器運行中！端口: ${PORT}`);
// });



const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// 解析 JSON 請求體
app.use(express.json());

// Discord Webhook URL
const discordWebhookUrl = "URL";

// 判斷是否包含 SOL 和 Fungible 代幣的轉移
function detectSolAndFungibleTokenTransfer(transaction) {
    const nativeTransfers = transaction.nativeTransfers || [];
    const tokenTransfers = transaction.tokenTransfers || [];

    let hasSolTransfer = false;
    let fungibleTokenTransfers = [];

    // 檢查是否有 SOL 轉移
    nativeTransfers.forEach(transfer => {
        if (transfer.amount !== 0) {
            hasSolTransfer = true;
        }
    });

    // 檢查是否有 Fungible 代幣轉移
    tokenTransfers.forEach(transfer => {
        if (transfer.tokenStandard === "Fungible") {
            fungibleTokenTransfers.push(transfer);
        }
    });

    // 如果有 SOL 轉移且至少有一個 Fungible 代幣轉移，則返回相關數據
    if (hasSolTransfer && fungibleTokenTransfers.length > 0) {
        return {
            hasSolAndFungibleTransfer: true,
            solTransfers: nativeTransfers,
            fungibleTokenTransfers
        };
    }

    return { hasSolAndFungibleTransfer: false };
}

// 提取核心交易信息
function getTransactionDetails(transaction) {
    const solAndFungibleTransfer = detectSolAndFungibleTokenTransfer(transaction);

    if (solAndFungibleTransfer.hasSolAndFungibleTransfer) {
        return {
            actionType: 'SOL 和 Fungible 代幣轉移',
            solTransfers: solAndFungibleTransfer.solTransfers,
            fungibleTokenTransfers: solAndFungibleTransfer.fungibleTokenTransfers,
            signature: transaction.signature,
            slot: transaction.slot
        };
    } else {
        return null; // 如果沒有符合條件的轉移，返回 null
    }
}

// 發送交易信息到 Discord
async function sendToDiscord(transactionDetails) {
    let messageContent = `交易通知:
    簽名: ${transactionDetails.signature}
    槽位: ${transactionDetails.slot}
    操作類型: ${transactionDetails.actionType}\n\n`;

    // 添加 SOL 轉移的詳細信息
    transactionDetails.solTransfers.forEach((transfer, index) => {
        messageContent += `SOL 轉移 ${index + 1}:
        - 轉出賬戶: ${transfer.fromUserAccount}
        - 接收賬戶: ${transfer.toUserAccount}
        - 金額: ${(transfer.amount / 1000000000).toFixed(9)} SOL\n\n`;
    });

    // 添加 Fungible 代幣轉移的詳細信息
    transactionDetails.fungibleTokenTransfers.forEach((transfer, index) => {
        messageContent += `Fungible 代幣轉移 ${index + 1}:
        - 代幣 Mint: ${transfer.mint}
        - 轉出賬戶: ${transfer.fromUserAccount}
        - 接收賬戶: ${transfer.toUserAccount}
        - 數量: ${transfer.tokenAmount}\n\n`;
    });

    const message = { content: messageContent };

    try {
        const response = await axios.post(discordWebhookUrl, message);
        console.log('成功將消息發送到 Discord: ', response.status);
    } catch (error) {
        console.error('發送到 Discord 失敗: ', error.response ? error.response.data : error.message);
        throw new Error('發送到 Discord 失敗');
    }
}

// 接收 Helius Webhook 的 POST 請求
app.post('/webhook', async (req, res) => {
    const transactionData = req.body[0];

    console.log("收到 Helius Webhook 通知: ", JSON.stringify(transactionData, null, 2));

    try {
        // 提取並判斷交易類型
        const transactionDetails = getTransactionDetails(transactionData);

        if (transactionDetails) {
            // 如果符合條件，發送到 Discord
            await sendToDiscord(transactionDetails);
        }
        res.status(200).send({ body: "Webhook received and processed!" });
    } catch (error) {
        console.error('處理 Webhook 時發生錯誤: ', error.message);
        res.status(500).send({ error: "Failed to process webhook" });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`伺服器運行中！端口: ${PORT}`);
});
