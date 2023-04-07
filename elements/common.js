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
    width: 65px;
    height: 65px;
`

const Image = styled.Image`
    height: 100%;
    width: 100%;
    resizeMode: cover;
`

const IconContainer = styled.Image`
    height: 30px;
`

export const ImageContainer = ({image}) => {
    const url = image? CommonUtility.useBackendImage(image):null;
    console.log("url: ",url)
    return (
        <Container>
            {url? <Image source={url} /> : <IconContainer source={userIcon} /> }
        </Container>
    )
}