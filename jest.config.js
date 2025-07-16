module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    collectCoverage: true,
    collectCoverageFrom: [
        'utils/**/*.js',
        'routes/**/*.js',
        'app.js',
        '!node_modules/**',
        '!test/**'
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html']
}; 