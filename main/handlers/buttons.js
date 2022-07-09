module.exports = async (client, PG, ascii) => {
    const table = new ascii('Buttons Loaded');
    (await PG(`${process.cwd()}/buttons/*/*.js`)).map(async (file) => {
        const button = require(file);

        const L = file.split('/');
        if (!button.id) {
            await table.addRow(`${L[5]}`, `Missing ID`);
        };
        client.buttons.set(button.id, button);
        await table.addRow(button.id,"🟩 SUCCESSFUL !");
    });
    console.log(table.toString());
}