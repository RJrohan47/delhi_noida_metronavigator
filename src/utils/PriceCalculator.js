export const calculateMetroFare = (distance) => {
    if (distance <= 2) return 10;
    else if (distance <= 5) return 20;
    else if (distance <= 12) return 30;
    else if (distance <= 21) return 40;
    else if (distance <= 32) return 50;
    else return 60;
};
