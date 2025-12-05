export class Personnel {
    /**
     * @param {Date} startDate
     */
    constructor(startDate) {
        this.startDate = startDate
        this.endDate = new Date(startDate).setMonth(startDate.getMonth + 21)
    }

    /**
     * @param {string} cls
     */
    getPromotionDay(cls) {
        let s = new Date(this.startDate)
        if (this.startDate.getDate() !== 1) {
            // s = new Date(s.setMonth(s.getMonth() + 1))
            s = new Date(s.setDate(1))
        }
        return {
            이등병: this.startDate,
            일병: new Date(s.setMonth(s.getMonth() + 2)),
            상병: new Date(s.setMonth(s.getMonth() + 6)),
            병장: new Date(s.setMonth(s.getMonth() + 6))
        }[cls]
    }

    getCurrentWorkingDays() {
        return Math.ceil((new Date() - this.startDate) / (1000 * 60 * 60 * 24))
    }

    static CLASSES = ["이등병", "일병", "상병", "병장"]

    /**
     * @param {Date} date
     */
    getClass(date) {
        for (let cls of Personnel.CLASSES.toReversed())
            if (this.getPromotionDay(cls) <= date)
                return cls
        return "[오류]"
    }

    getSurplusPrommotionDays() {
        let curClass = this.getClass(new Date())
        if (curClass === "병장") return 0
        let nextClass = Personnel.CLASSES[Personnel.CLASSES.indexOf(curClass) + 1]
        return Math.floor((this.getPromotionDay(nextClass) - new Date()) / (1000 * 60 * 60 * 24))
    }

    getSalary(class_) {
        return {
            이등병: 750000,
            일병: 900000,
            상병: 1200000,
            병장: 1500000
        }[class_]
    }
}
