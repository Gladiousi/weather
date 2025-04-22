export const convertPressureToMmHg = (hPa: number) => Math.round(hPa * 0.750062);

export const getTooltip = (type: string, value: number) => {
    switch (type) {
        case "temperature":
            if (value >= 18 && value <= 25) return "Норма: 18–25°C. Комфортная температура.";
            if (value < 18) return "Норма: 18–25°C. Холодно, оденьтесь теплее.";
            return "Норма: 18–25°C. Жарко, пейте больше воды.";
        case "humidity":
            if (value >= 30 && value <= 60) return "Норма: 30–60%. Комфортная влажность.";
            if (value < 30) return "Норма: 30–60%. Слишком сухо, возможен дискомфорт.";
            return "Норма: 30–60%. Высокая влажность, может быть душно.";
        case "pressure":
            const mmHg = convertPressureToMmHg(value);
            if (mmHg >= 740 && mmHg <= 760) return "Норма: 740–760 мм рт. ст. Нормальное давление.";
            if (mmHg < 740) return "Норма: 740–760 мм рт. ст. Пониженное давление, возможны головные боли.";
            return "Норма: 740–760 мм рт. ст. Повышенное давление, будьте осторожны.";
        case "wind":
            if (value <= 5) return "Норма: до 5 м/с. Легкий ветер, комфортно.";
            if (value <= 10) return "Норма: до 5 м/с. Умеренный ветер, возможны порывы.";
            return "Норма: до 5 м/с. Сильный ветер, будьте осторожны.";
        default:
            return "";
    }
};
