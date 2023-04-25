import React, { useMemo, useState } from 'react'
import styled from 'styled-components/native';
import DrawerHook from '../hooks/handleDrawer'
import { close,listDashes,arrowRight,play,pause, tick,list, listDashesWhite, playWhite, pauseWhite, tickWhite, listWhite, closeWhite } from './importingImages'
import { useAuth } from '../contexts/auth'
import { TouchableOpacity } from 'react-native';
import { useNavigation , useRoute } from '@react-navigation/native';
import { ImageContainer } from '../elements/common';
import { colors } from '../utility/theme';
import { View, Text } from 'react-native';

const DrawerContainer = styled.View`
    position: absolute;
    top: 0;
    left: ${({isOpen})=>isOpen? "0px":"-280px"};
    transition: 0.3s ease-in-out;
    width: 100vw;
    height: 100vh;
    display: flex;
    z-index: 3;
    flex-direction: row;
`

const NavContainer = styled.View`
    color: white;
    width: 280px;
    height: 100%;
    display: flex;
    justify-content: start;
    flex-direction: column;
    align-items: center;
    background-color: ${colors.navBg};
`

const ProfileContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 30px;
    margin-top: 40px;
    margin-bottom: 50px;
`

const AlignCenter = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const H3 = styled.Text`
    font-size: 20px;
    color: white;
`
    
const H4 = styled.Text`
    color: ${({selected})=>selected? "black":"white"};
    font-size: 16px;
    opacity: ${({dimmed})=>dimmed? "0.5":"1"};
    margin-left: ${({marginLeft})=>marginLeft? `${marginLeft}px`:"0"};
`

const IconContainer = styled.Image`
    height: 20px;
    width: 20px;
`

const MenuItem = styled.TouchableOpacity`
    width: 220px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    flex-direction: row;
    background-color: ${({selected})=> selected? colors.yellow:"" }
    border-radius: 5px;
    margin: 10px 0;
`

const MenuContainer = styled.View`
    width: 100%;
    background-color: ${colors.navBg};
    height: 50px;
    display: flex;
    justify-content: center;
    display: ${({disable})=> disable? "none":"" };
    padding-left: 20px;
`

const LogoutButton = styled.TouchableOpacity`
    width: 220px;
    padding: 10px;
    border: 2px solid ${colors.yellow};
    border-radius: 5px;
    margin: 10px 0;
    margin-top: auto;
    letter-spacing: 3px;
    font-size: 14;
    text-align: center;
`

const Navigation = () => {
    const navigation = useNavigation();
    const { isOpen , openDrawer , closeDrawer } = DrawerHook()
    const { isVendor , user, logout} = useAuth()
    const route = useRoute();
    const routeName = route.name

    const menuItems = useMemo(()=>{
        if(isVendor){
            return [
                {
                    icon: routeName === "Vendor_availableOrders"? listDashes : listDashesWhite ,
                    name: "Available Requests",
                    routeName: "Vendor_availableOrders",
                    selected: routeName === "Vendor_availableOrders"
                },
                {
                    icon: routeName === "Vendor_inProcessOrders"? play : playWhite,
                    name: "In-Process Requests",
                    routeName: "Vendor_inProcessOrders",
                    selected: routeName === "Vendor_inProcessOrders"
                }
            ]
        }else{
            return [
                {
                    icon: routeName === "User_order"? listDashes : listDashesWhite,
                    name: "Order Now",
                    routeName: "User_order",
                    selected: routeName === "User_order"
                },
                {
                    icon: routeName === "User_process"? pause : pauseWhite,
                    name: "Process",
                    routeName: "User_process",
                    selected: routeName === "User_process"
                },
                {
                    icon: routeName === "User_completed"? tick : tickWhite,
                    name: "Completed",
                    routeName: "User_completed",
                    selected: routeName === "User_completed"
                },
            ]
        }
    })

    const handleMenuItem = (name) => {
        closeDrawer()
        setTimeout(()=>{
            navigation.navigate(name)
        },[400])
    }

    const handleLogout = () => {
        logout()
        closeDrawer()
        setTimeout(()=>{
            navigation.navigate("Registration")
        },[400])
    }

    return (<>{ user && 
    <DrawerContainer isOpen={isOpen}>
         <NavContainer>
            <ProfileContainer>
                <ImageContainer image={user.profile} />
                <View>
                    <H3>{user.name}</H3>
                    <H4 dimmed >{user.type}</H4>
                </View>
            </ProfileContainer>
            <View>
                {menuItems.map((item)=>(
                    <MenuItem key={item.name} selected={item.selected} onPress={()=>handleMenuItem(item.routeName)} >
                        <AlignCenter>
                            <IconContainer source={item.icon} />
                            <H4 marginLeft={10} selected={item.selected}>{item.name}</H4>
                        </AlignCenter>
                        <IconContainer source={arrowRight} />
                    </MenuItem>
                ))}
            </View>
            <LogoutButton onPress={handleLogout} >
                <Text style={{color : `${colors.yellow}`}} >
                    LOGOUT
                </Text>
            </LogoutButton>
        </NavContainer>
        <MenuContainer >
            { isOpen? 
                <TouchableOpacity onPress={closeDrawer} >
                    <IconContainer source={closeWhite} />
                </TouchableOpacity> : 
                <TouchableOpacity onPress={openDrawer} >
                    <IconContainer source={listWhite} />
                </TouchableOpacity>
            }
        </MenuContainer> 
      </DrawerContainer>
    }</>
    )
}

export default Navigation