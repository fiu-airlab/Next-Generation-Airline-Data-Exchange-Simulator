function modifyDate(date) {
    const month = monthFromName(date.split(" ")[1]);
    const day = date.split(" ")[2];
    const year = date.split(" ")[3];

    const newDate = year + '-' + month + '-' + day;
    
    return newDate;
}

function monthFromName(month){
    switch (month) {
        case 'Jan':
            return '01';
        case 'Feb':
            return '02';
        case 'Mar':
            return '03';
        case 'Apr':
            return '04';
        case 'May':
            return '05';
        case 'Jun':
            return '06';
        case 'Jul':
            return '07';
        case 'Aug':
            return '08';
        case 'Sep':
            return '09';
        case 'Oct':
            return '10';
        case 'Nov':
            return '11';
        case 'Dec':
            return '12';
        default:
            break;
    }
}

function OneDigitBellowTen(n) {
    if (n < 10) {
        return n.split('')[1];
    }
    else
        return n;
}

module.exports = modifyDate;