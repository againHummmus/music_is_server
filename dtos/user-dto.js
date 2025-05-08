module.exports = class userDto {
    email;
    id;
    sub;
    is_activated;
    Artist;
    app_role;

    constructor(user) {
        this.email = user.email;
        this.id = user.id;
        this.sub = user.sub;
        this.is_activated = user.is_activated;
        this.app_role = user.app_role;
        this.Artist = user.Artist;
    }
}