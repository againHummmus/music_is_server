const sequelize = require('./db');
const {DataTypes} = require("sequelize");

const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
});

const Playlist = sequelize.define('Playlist', {
    name: DataTypes.STRING
});

const PlaylistTrack = sequelize.define('PlaylistTrack', {});

const Track = sequelize.define('Track', {
    name: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    fileName: DataTypes.STRING,
    playsNumber: DataTypes.INTEGER
});

const Album = sequelize.define('Album', {
    name: DataTypes.STRING,
    year: DataTypes.INTEGER,
    image: DataTypes.STRING
});

const Artist = sequelize.define('Artist', {
    name: DataTypes.STRING,
    image: DataTypes.STRING
});

const Genre = sequelize.define('Genre', {
    name: DataTypes.STRING
});


User.hasMany(Playlist, {foreignKey: 'userID'});
Playlist.belongsTo(User, {foreignKey: 'userID'});

Playlist.hasMany(PlaylistTrack, {foreignKey: 'playlistID'});
PlaylistTrack.belongsTo(Playlist, {foreignKey: 'playlistID'});

Track.hasOne(PlaylistTrack, {foreignKey: 'trackID'});
PlaylistTrack.belongsTo(Track, {foreignKey: 'trackID'});

Album.hasMany(Track, {foreignKey: 'albumID'});
Track.belongsTo(Album, {foreignKey: 'albumID'});

Artist.hasMany(Album, {foreignKey: 'artistID'});
Album.belongsTo(Artist, {foreignKey: 'artistID'});

Genre.hasMany(Track, {foreignKey: 'genreID'});
Track.belongsTo(Genre, {foreignKey: 'genreID'});

Artist.hasMany(Track, {foreignKey: 'artistID'});
Track.belongsTo(Artist, {foreignKey: 'artistID'});

module.exports = {User, Album, Artist, Genre, Playlist, Track, PlaylistTrack}
