module.exports = class userDto {
    email;
    id;
    is_activated;
    Artist;
    User_profile;
    role;

    constructor(user) {
        this.email = user.email;
        this.id = user.id;
        this.is_activated = user.is_activated;
        this.role = user.role;
        this.Artist = user.Artist;
        this.User_profile = user.User_profile
    }
}