import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Logo = () => {
    const [index, setIndex] = useState(0);
    const [isSpecialCase, setIsSpecialCase] = useState(false);
    const textToReplace = ['Toothbrush', 'Tylenol', 'Coat', 'Shoe', 'Salt','Remote', 'Stuff'];

    useEffect(() => {
        const interval = setInterval(() => {
            if (index === textToReplace.length - 1) {
                setIsSpecialCase(true);
                setTimeout(() => {
                    setIsSpecialCase(false);
                    setIndex((prevIndex) => (prevIndex + 1) % textToReplace.length);
                }, 2000);
            } else {
                setIndex((prevIndex) => (prevIndex + 1) % textToReplace.length);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [index]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Where's my{' '}
                <Text style={styles.boldText}>
                    {isSpecialCase ? textToReplace[textToReplace.length - 1] : textToReplace[index]}
                </Text>
                ?
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
});

export default Logo;
