const { Events } = require('../validation/eventNames');

module.exports = async (client, PG, ascii) => {
    const table = new ascii('Events Loaded');

    (await PG(`${process.cwd()}/events/*/*.js`)).map(async (file) => {
        const event = require(file);

        const L = file.split('/');
        if (!Events.includes(event.name) || !event.name) {
            await table.addRow(`${event.name || 'MISSING'}`, `❌ Event name is either invalid or missing: ${L[6]+ `/` + L[7] + `/` + L[8]}`);
        };
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        };

        await table.addRow(`${L[8]}`,event.name, "🟩 SUCCESSFUL !");
    });
    console.log(table.toString());
}