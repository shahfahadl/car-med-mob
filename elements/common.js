import { CommonUtility } from "../utility/common"
import styled from 'styled-components/native'; 
import userIcon from '../assets/user.svg'

const Container = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid white;
    width: ${({width})=>width}px;
    height: ${({height})=>height}px;
`

const Image = styled.Image`
    height: 100%;
    width: 100%;
    resizeMode: cover;
`

const IconContainer = styled.Image`
    height: 30px;
`

export const ImageContainer = ({image , width=65 , height=65}) => {
    const url = image? CommonUtility.useBackendImage(image):null;
    return (
        <Container width={width} height={height} >
            {url? <Image source={url} /> : <IconContainer source={userIcon} /> }
        </Container>
    )
}