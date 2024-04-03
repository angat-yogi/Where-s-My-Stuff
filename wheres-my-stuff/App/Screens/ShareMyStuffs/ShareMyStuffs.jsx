import React, { useState } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, TouchableOpacity, StyleSheet,Share } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import Header from '../HomeScreen/Header';

export default function ShareMyStuffs() {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likedPosts, setLikedPosts] = useState(new Set());
    const share = async (imageUrl)=> {

        try {
         await Share.share({
                message: imageUrl,
            })
        } catch (error) {
            
        }
      }
    // Dummy data for images with comments
    const images = [
        { 
            id: 1, 
            imageUrl: 'https://i.etsystatic.com/29236970/r/il/1b16dc/3532343484/il_300x300.3532343484_mb99.jpg', 
            comments: ['First comment for image 1', 'Second comment for image 1'] 
        },
        { 
            id: 2, 
            imageUrl: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2022/10/Different-interior-design-styles-in-a-chic-interior-by-Jatnna-M.jpg', 
            comments: ['Wow'] 
        },
        { 
            id: 3, 
            imageUrl: 'https://i.etsystatic.com/29236970/r/il/1b16dc/3532343484/il_300x300.3532343484_mb99.jpg', 
            comments: ['First comment for image 1', 'Second comment for image 1'] 
        },
        { 
            id: 4, 
            imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/they-are-wearing-street-style-on-february-27-during-paris-news-photo-1692802180.jpg', 
            comments: ['First comment for image 2'] 
        },
        { 
            id: 5, 
            imageUrl: 'https://i.etsystatic.com/29236970/r/il/1b16dc/3532343484/il_300x300.3532343484_mb99.jpg', 
            comments: ['First comment for image 1', 'Second comment for image 1'] 
        },
        { 
            id: 6, 
            imageUrl: 'https://www.decorilla.com/online-decorating/wp-content/uploads/2022/10/Different-interior-design-styles-in-a-chic-interior-by-Jatnna-M.jpg', 
            comments: ['Amazing'] 
        },
        { 
            id: 7, 
            imageUrl: 'https://i.etsystatic.com/29236970/r/il/1b16dc/3532343484/il_300x300.3532343484_mb99.jpg', 
            comments: ['First comment for image 1', 'Second comment for image 1'] 
        },
        { 
            id: 8, 
            imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/they-are-wearing-street-style-on-february-27-during-paris-news-photo-1692802180.jpg', 
            comments: ['First comment for image 2'] 
        },
    
    ];

    const renderCommentItem = ({ item }) => (
        <View style={styles.commentItem}>
            <Text>{item}</Text>
        </View>
    );

    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            setComments([...comments, newComment]);
            setNewComment('');
        }
    };

    const handleLikePost = (postId) => {
        if (likedPosts.has(postId)) {
            likedPosts.delete(postId);
        } else {
            likedPosts.add(postId);
        }
        setLikedPosts(new Set(likedPosts)); // Force re-render by updating state
    };
    const handleSharePost=(id)=>{
        share();
    }

    const isPostLiked = (postId) => {
        return likedPosts.has(postId);
    };

    return (
        <>
              <Header icon="camera" action="Camera" shouldDisplayProfile={true}/>
              <View style={styles.container}>
        <FlatList
            showsVerticalScrollIndicator={false}
            data={images}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.postContainer}>
                    <TouchableOpacity onPress={() => handleLikePost(item.id)}>
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                    </TouchableOpacity>
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity onPress={() => handleLikePost(item.id)}>
                            <Text style={[styles.actionText, { color: isPostLiked(item.id) ? 'red' : 'black' }]}>
                                {isPostLiked(item.id) ? <FontAwesome6 name="heart-circle-check" size={24} color="red" />: <FontAwesome6 name="heart-circle-xmark" size={24} color="black" />}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => share(item.imageUrl)}>
                            <Text style={[styles.actionText, { color: 'black' }]}>
                            <Entypo name="share" size={20} color="black" />
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.commentSection}>
                        <View style={styles.commentItem}>
                            <Text>{item.comments[0]}</Text>
                        </View>
                        <View style={styles.commentInputContainer}>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Add a comment..."
                                value={newComment}
                                onChangeText={(text) => setNewComment(text)}
                            />
                            <Button title="Post" onPress={handleAddComment} />
                        </View>
                    </View>
                </View>
            )}
        />
    </View>
</>
       
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop:20,
        flex: 1,
        backgroundColor: '#fff',
    },
    postContainer: {
        marginVertical: 10,
        marginHorizontal:10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Aligns children to the start and end of the container
        paddingHorizontal: 20,
        marginTop: 5,
    },
    actionText: {
        fontWeight: 'bold',
    },
    commentSection: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    commentsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    commentInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    commentItem: {
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
