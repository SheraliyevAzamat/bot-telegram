import { Bot } from "grammy";

const BOT_TOKEN = process.env.BOT_TOKEN;
console.log(BOT_TOKEN);

const bot = new Bot(BOT_TOKEN);

const carsForSale = [
    { id: 1, model: "Toyota Corolla", year: 2020, price: 12000, description: "Yangi holat, 30,000 km yurilgan" },
    { id: 2, model: "BMW 3 Series", year: 2018, price: 25000, description: "A'lo holat, 50,000 km yurilgan" },
    { id: 3, model: "Mercedes Benz C-Class", year: 2019, price: 35000, description: "Juda yaxshi holat, 40,000 km yurilgan" },
    { id: 4, model: "Honda Civic", year: 2021, price: 18000, description: "Yangi, 10,000 km yurilgan" }
];

bot.on("message", (ctx) => {
    const userId = ctx.message.from.id;
    const messageText = ctx.message.text.toLowerCase();

    if (messageText === "/start") {
        ctx.reply(
            "Xush kelibsiz! Onlayn moshina savdo botiga! \n\nSiz quyidagi amallarni bajarishingiz mumkin:\n1. 'cars' - Sotuvdagi moshinalarni ko'rish\n2. 'sell' - Moshina sotish\n3. 'help' - Yordam"
        );
        return;
    }

    if (messageText === "cars") {
        let carsList = "Sotuvdagi moshinalar:\n";
        carsForSale.forEach((car) => {
            carsList += `\n${car.model} (${car.year}) - $${car.price}\n${car.description}\n`;
        });
        ctx.reply(carsList);
        return;
    }

    if (messageText === "sell") {
        ctx.reply("Siz sotmoqchi bo'lgan moshinangizning modelini kiriting.");
        return;
    }

    if (!ctx.session.sellingCar) {
        if (messageText) {
            ctx.session.sellingCar = { model: messageText }; 
            ctx.reply("Moshina yili va narxini kiriting.");
        }
        return;
    }

    if (ctx.session.sellingCar && !ctx.session.sellingCar.year) {
        ctx.session.sellingCar.year = messageText;
        ctx.reply("Moshina tavsifini (masalan, holati) kiriting.");
        return;
    }

    if (ctx.session.sellingCar && !ctx.session.sellingCar.price) {
        ctx.session.sellingCar.price = messageText;
        ctx.reply("Moshina tavsifini kiriting.");
        return;
    }

    if (ctx.session.sellingCar && !ctx.session.sellingCar.description) {
        ctx.session.sellingCar.description = messageText;
        carsForSale.push(ctx.session.sellingCar); 
        ctx.reply(`Moshina qo'shildi: ${ctx.session.sellingCar.model} (${ctx.session.sellingCar.year}) - $${ctx.session.sellingCar.price}\nTavsifi: ${ctx.session.sellingCar.description}`);
        delete ctx.session.sellingCar; 
        return;
    }

    if (messageText === "help") {
        ctx.reply(
            "Onlayn moshina savdo botiga xush kelibsiz!\n1. 'cars' - Sotuvdagi moshinalarni ko'rish\n2. 'sell' - Moshina sotish\n3. 'help' - Yordam\n\nHar qanday savollar uchun bizga yozing!"
        );
        return;
    }
});

bot.start();
