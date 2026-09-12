const { validationResult } = require('express-validator');
const Post = require('../model/post');
const fileHelper = require('../util/file')

exports.getPosts = async (req, res, next) => {
    try{
        const currentPage = req.query.page || 1;
        const perPage = 2;
        const countItems = await Post.find().countDocuments();
        const posts = await Post.find()
        .skip((currentPage -1) * perPage)
        .limit(perPage)

        res.status(200).json({message:'Fetched posts successfully', posts: posts, totalItems: countItems});
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    }  
    
}

exports.getPost = async (req, res, next) => {
    try{
        const postId = req.params.postId
        const post = await Post.findById(postId)
        if(!post){
            const error = new Error('Could not find post');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({message: "Post fetched", post: post})
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err)
    }
    
}

exports.postPost = async (req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors);
            const error = new Error('Validation failed, entered data is incorrect.');
            error.statusCode = 422;
            throw error;
        }
        if(!req.file){
            const error = new Error('No image Provided');
            error.statusCode = 422;
            throw error;
        }
        const imageUrl = req.file.path.replace("\\" ,"/");
        const title = req.body.title;
        const content = req.body.content;

        const post = await new Post({
            title: title,
            content:content,
            imageUrl: imageUrl,
            creator: {
                name: 'Gabriel'
            }
        }).save();

        res.status(201).json(
            {   
                message: 'Post created successfully!', 
                post: post
            }
        );
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    }   
}

exports.updatePost = async (req, res, next) => {
    try{
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post){
            const error = new Error('Could not find post to update');
            error.statusCode = 404;
            throw error;
        }
        post.title = req.body.title;
        post.content = req.body.content;
        if(req.file){
            if(post.imageUrl){
                fileHelper.deleteFile(post.imageUrl);
            }
            post.imageUrl = req.file.path.replace("\\" ,"/");
        }
        const result = await post.save();

        res.status(200).json({message: "Product Updated",  post: result})
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    }  
}

exports.deletePost = async (req, res, next) => {
    try{
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if(!post){
            const error = new Error('Could not find post to delete');
            error.statusCode = 404;
            throw error;
        }
        if(post.imageUrl){
            fileHelper.deleteFile(post.imageUrl);
        }
        await post.deleteOne()

        res.status(200).json({message: "Post deleted successfully!"})
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500
        }
        next(err);
    } 
}