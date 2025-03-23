module.exports = class userDto {
    email;
    id;
    isActivated;

    constructor(user) {
        this.email = user.email;
        this.id = user.id;
        this.isActivated = user.isActivated;
    }
}