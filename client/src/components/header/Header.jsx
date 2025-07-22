import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  ConfigProvider,
  Dropdown,
  Empty,
  Flex,
  Space,
  Typography,
  Drawer,
  Input,
  Menu,
  message,
  Form,
  notification,
} from "antd";
import {
  BellOutlined,
  BookOutlined,
  CalendarOutlined,
  DownOutlined,
  EditOutlined,
  HeartOutlined,
  LaptopOutlined,
  MenuOutlined,
  MessageOutlined,
  RollbackOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UngroupOutlined,
  UserOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth";
import { useAPI } from "../../hooks/api";
import Loader from "../Loader";
import axios from "axios";

const Header = () => {
  let user = JSON.parse(localStorage.getItem("user"));
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  let itemProfile = [];
  if (user != null) {
    itemProfile = [
      {
        key: "1",
        label: (
          <Space
            direction="vertical"
            align="center"
            justify="center"
            className="p-4"
          >
            <Avatar
              size={64}
              src="https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png"
            />
            <Typography.Title level={5}>{user.account.name}</Typography.Title>
            <Typography.Text>{user.account.email}</Typography.Text>
          </Space>
        ),
      },
      {
        key: "signout",
        label: "Log out",
        icon: <RollbackOutlined />,
      },
    ];

    // Conditionally hide "Become an Instructor" for teachers
    if (user.account.role === "teacher" || user.account.role === "admin") {
      itemProfile = itemProfile.filter(
        (item) => item.key !== "become_instructor"
      );
    } else {
      // itemProfile.push({
      //   key: "become_instructor",
      //   label: "Become an Instructor",
      //   icon: <BookOutlined />,
      // });
    }
  }



  const handleClickProfile = ({ key }) => {
    if (key === "signout") {
      navigate(authContext.signout());
    } else if (key === "calendar") {
      navigate("/home/calendar");
    } else if (key === "my_course") {
      navigate("/home/my_courses");
    } else if (key === "user_profile") {
      navigate("/home/user_credentials");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <header className="py-1">
      <div className="container mx-auto max-w-screen-xl flex justify-between items-center p-1">
        <Link to={"/"} className="logo w-[136px] h-[36px]">
          <img src={logo} alt="logo" className="w-full h-full object-contain" />
        </Link>
        <Flex justify="flex-end" className="flex-1 items-center gap-4">
          {authContext.user ? (
            <>
              <div className="px-4 py-2 rounded cursor-pointer">
                <Flex align="center" gap={2} className="text-black">
                  <Link
                    to={"/home/my_courses"}
                    className="text-base font-semibold"
                  >
                    Đề thi online
                  </Link>
                </Flex>
              </div>
              {user.account.role === "teacher" &&
              user.account.is_verified === true ? (
                <div className="px-4 py-2 rounded cursor-pointer">
                  <Flex align="center" gap={0} className="text-black">
                    <Link
                      to={"/admin/quiz"}
                      className="text-base font-semibold"
                    >
                      Chế độ giáo viên
                    </Link>
                  </Flex>
                </div>
              ) : null}

              <div className="px-4 py-2 rounded cursor-pointer">
                <Flex align="center" gap={2} className="text-black">
                  <Dropdown
                    menu={{
                      items: itemProfile,
                      onClick: handleClickProfile,
                    }}
                    placement="bottomRight"
                  >
                    <Avatar src="https://demo.creativeitem.com/academy/uploads/user_image/placeholder.png" />
                  </Dropdown>
                </Flex>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 rounded cursor-pointer">
                <Flex align="center" gap={2} className="text-black">
                  <Link to={"/login"} className="text-base font-semibold">
                    Login
                  </Link>
                </Flex>
              </div>
              <div className="px-4 py-2 rounded cursor-pointer">
                <Flex align="center" gap={2}>
                  <Link
                    to={"/signup"}
                    className="text-base text-black font-semibold"
                  >
                    Join now
                  </Link>
                </Flex>
              </div>
            </>
          )}
        </Flex>
      </div>
    </header>
  );
};

export default Header;
