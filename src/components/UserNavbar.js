import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Button, Drawer, List, ListItem, ListItemText, Typography, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon, AccountCircle, PostAdd, Visibility, Security, ShoppingCart } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../ContextAPI/AuthContext";

const UserNavbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  return (
    <AppBar position="static" color="default" sx={{ boxShadow: 3 }}>
      <Toolbar>
        {/* Mobile Menu Button */}
        <IconButton edge="start" color="inherit" onClick={toggleDrawer} sx={{ display: { xs: "block", md: "none" } }}>
          <MenuIcon />
        </IconButton>
        
        {/* Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Sell Any Product
        </Typography>

        {/* Desktop Navigation Links */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          <Button component={NavLink} to="/profile" startIcon={<AccountCircle />}>
            {t("Profile")}
          </Button>
          <Button component={NavLink} to="/postad" startIcon={<PostAdd />}>
            {t("postAd")}
          </Button>
          <Button component={NavLink} to="/viewads" startIcon={<Visibility />}>
            {t("postedAds")}
          </Button>
          <Button component={NavLink} to="/soldoutproducts" startIcon={<ShoppingCart />}>
            {t("soldProducts")}
          </Button>
          <Button component={NavLink} to="/security" startIcon={<Security />}>
            {t("security")}
          </Button>
          <Button
            startIcon={<LogoutIcon />}
            onClick={() => setIsLogoutDialogOpen(true)}
            color="error"
            variant="contained"
          >
            {t("logout")}
          </Button>
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <List sx={{ width: 250 }}>
          <ListItem button component={NavLink} to="/profile" onClick={toggleDrawer}>
            <AccountCircle />
            <ListItemText primary={t("Profile")} secondary={i18n.language === "ur" ? "پروفائل" : ""} sx={{ marginLeft: 2 }} />
          </ListItem>
          <ListItem button component={NavLink} to="/postad" onClick={toggleDrawer}>
            <PostAdd />
            <ListItemText primary={t("postAd")} secondary={i18n.language === "ur" ? "اشتہار لگائیں" : ""} sx={{ marginLeft: 2 }} />
          </ListItem>
          <ListItem button component={NavLink} to="/viewads" onClick={toggleDrawer}>
            <Visibility />
            <ListItemText primary={t("postedAds")} secondary={i18n.language === "ur" ? "اشتہارات دیکھیں" : ""} sx={{ marginLeft: 2 }} />
          </ListItem>
          <ListItem button component={NavLink} to="/soldoutproducts" onClick={toggleDrawer}>
            <ShoppingCart />
            <ListItemText primary={t("soldProducts")} secondary={i18n.language === "ur" ? "فروخت شدہ مصنوعات" : ""} sx={{ marginLeft: 2 }} />
          </ListItem>
          <ListItem button component={NavLink} to="/security" onClick={toggleDrawer}>
            <Security />
            <ListItemText primary={t("security")} secondary={i18n.language === "ur" ? "سیکیورٹی" : ""} sx={{ marginLeft: 2 }} />
          </ListItem>
          <ListItem button onClick={() => setIsLogoutDialogOpen(true)}>
            <LogoutIcon />
            <ListItemText primary={t("logout")} secondary={i18n.language === "ur" ? "لاگ آؤٹ" : ""} sx={{ marginLeft: 2 }} />
          </ListItem>
        </List>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onClose={() => setIsLogoutDialogOpen(false)}>
        <DialogTitle>{t("logout")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("Are you sure you want to logout?")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsLogoutDialogOpen(false)} color="primary">
            {t("Cancel")}
          </Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            {t("Logout")}
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default UserNavbar;
