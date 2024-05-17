class helpdeskTicket {
    /*attributes
    ticketId
    user,
    title,
    details,
    dateReported,
    dateClosed,
    ticketStatus
    */
    constructor (user) {
        this.ticketId = "";
        this.user = user;
        this.title = "";
        this.details = "";
        this.dateReported = "";
        this.dateClosed = null;
        this.ticketStatus = "drafted"
    }

    getTitle() {
        return this.title;
    }

    setTitle(ticketTitle) {
        this.title = ticketTitle;
    }

    getUser() {
        return this.user;
    }

    getTicketId() {
        return this.ticketId;
    }

    setTicketId() {
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth() + 1;
        let currentDay = currentDate.getDate();
        this.ticketId = currentYear * 10000 + currentMonth * 100 + currentDay
    }

    getDetails() {
        return this.details;
    }

    setDetails(newDetails) {
        this.details = newDetails;
    }

    getDateReported() {
        return this.dateReported;
    }

    setDateReported() {
        this.dateReported = new Date();
    }

    getDateClosed() {
        return this.dateClosed;
    }

    getTicketStatus() {
        return this.ticketStatus;
    }

    updateStatus(newStatus) {
        this.ticketStatus = newStatus;

        if (newStatus == "Closed") {
            this.dateClosed = new Date();
        }
    }

}