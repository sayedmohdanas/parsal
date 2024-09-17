import React from 'react';
import { View, StyleSheet } from 'react-native';

const BorderLine = ({ 
    color = 'black', 
    thickness = 2, 
    length = '100%', 
    margin = 10, 
    
    orientation = 'horizontal'  // 'horizontal' or 'vertical'
}) => {
    const isVertical = orientation === 'vertical';

    return (
        <View
            style={[
                styles.line,
                {
                    backgroundColor: color,
                    width: isVertical ? thickness : length,   
                    height: isVertical ? length : thickness,   
                    marginVertical: isVertical ? 0 : margin,
                    marginHorizontal: isVertical ? margin : 0,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    line: {
        backgroundColor: 'black',
    },
});

export default BorderLine;
