module.exports = class userDto {
    email;
    id;
    isActivated;

    constructor(user) {
        this.email = user.email;
        this.id = user.id;
        this.is_activated = user.is_activated;
    }
}