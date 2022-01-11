import express from 'express';

const app = express();

app.listen(() => {
    console.log(`Timezones by location application is running on port 3000.`);
});

export default app;