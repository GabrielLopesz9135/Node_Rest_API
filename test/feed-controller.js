const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../model/user');
const Post = require('../model/post');
const FeedController = require('../coontrollers/feed');
const socket = require('../socket');

const TEST_USER_ID = '5c0f66b979af55031b34728a';

describe('Feed Controller', function(){
    before(async function(){
        await mongoose.connect(process.env.MONGODB_URI);
        await Post.deleteMany({ creator: TEST_USER_ID });
        await User.findByIdAndDelete(TEST_USER_ID);
        await User.create({
            email: "test@example.com",
            password: "password123",
            name: "Test User",
            posts: [],
            _id: TEST_USER_ID
        });
    });

    it('should add a created post to the posts of the creator', async function(){
        const req = {
                body: {
                    title: "Test Post",
                    content: "A test post"
                },
                file: {
                    path: "test/path"
                },
                userId: TEST_USER_ID
            };

        const res = { status: function(){return this}, json: function(){return this}};
        const emit = sinon.spy();
        const getIO = sinon.stub(socket, 'getIO').returns({ emit });

        try {
            const savedUser = await FeedController.postPost(req, res, err => {
                throw err;
            });
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
        } finally {
            getIO.restore();
        }
    });

    after(async function(){
        await Post.deleteMany({ creator: TEST_USER_ID });
        await User.findByIdAndDelete(TEST_USER_ID);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });
});