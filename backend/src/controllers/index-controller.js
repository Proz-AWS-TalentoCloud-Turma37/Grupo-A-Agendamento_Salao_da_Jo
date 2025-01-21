import path from "path";

export const getIndex = (req, res) => {
    const filePath = path.join(process.cwd(), "../frontend", "index.html");
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Erro ao enviar o arquivo:", err.message);
            res.status(500).send("Erro ao carregar a página.");
        }
    });
};
