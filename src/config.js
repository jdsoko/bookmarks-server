module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://dunder_mifflin:poop@localhost/bookmarks',
    API_TOKEN: process.env.API_TOKEN || 'dummy-api-token',
}