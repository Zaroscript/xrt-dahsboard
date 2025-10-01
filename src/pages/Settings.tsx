import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon,
  User,
  Shield,
  Mail,
  Bell,
  Globe,
  Key,
  Save,
  Moon, 
  Sun, 
  Monitor 
} from "lucide-react";

// Add this to your global CSS or in a style tag
const globalStyles = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .tabs-list {
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0);
  }
  .tabs-list::-webkit-scrollbar {
    height: 8px;
  }
  .tabs-list::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
  }
  .tabs-list::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
  }
  .tabs-list::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;
import { loadCompanySettings, saveCompanySettings } from "@/utils/settings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppSelector, useAppDispatch } from "@/store/store";

const Settings = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.dashboard.theme);

  // Profile settings state
  const [profileSettings, setProfileSettings] = useState({
    name: "Admin User",
    email: "admin@xrt-tech.com",
    company: "Xrt-tech Ltd",
    bio: "Administration platform for Xrt-tech products and services.",
  });

  // Company settings state
  const [companySettings, setCompanySettings] = useState(loadCompanySettings());
  const [saveStatus, setSaveStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  // Load settings when component mounts
  useEffect(() => {
    setCompanySettings(loadCompanySettings());
  }, []);

  // Handle saving company settings
  const handleSaveCompanySettings = () => {
    const success = saveCompanySettings(companySettings);
    setSaveStatus({
      type: success ? 'success' : 'error',
      message: success ? 'Settings saved successfully!' : 'Failed to save settings.'
    });
    
    // Clear status after 3 seconds
    setTimeout(() => {
      setSaveStatus({ type: 'idle', message: '' });
    }, 3000);
  };

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    supportTickets: true,
    newUsers: true,
    payments: true,
    systemUpdates: false,
  });

  const [moderators, setModerators] = useState<
    Array<{ name: string; email: string; role: "moderator" | "user" }>
  >([
    { name: "Moderator", email: "moderator@xrt-tech.dev", role: "moderator" },
  ]);
  const [newModerator, setNewModerator] = useState<{
    name: string;
    email: string;
  }>({ name: "", email: "" });

  const handleSaveProfile = () => {
    // Handle save profile
    console.log("Save profile:", profileSettings);
  };

  const handleSaveNotifications = () => {
    // Handle save notifications
    console.log("Save notifications:", notificationSettings);
  };

  const handleAddModerator = () => {
    if (!newModerator.email) return;
    setModerators((prev) => [
      {
        name: newModerator.name || newModerator.email.split("@")[0],
        email: newModerator.email,
        role: "moderator",
      },
      ...prev,
    ]);
    setNewModerator({ name: "", email: "" });
  };

  const handleUpdateModeratorRole = (
    email: string,
    role: "moderator" | "user"
  ) => {
    setModerators((prev) =>
      prev.map((m) => (m.email === email ? { ...m, role } : m))
    );
  };

  const handleRemoveModerator = (email: string) => {
    setModerators((prev) => prev.filter((m) => m.email !== email));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            <span>Settings</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account and system preferences
          </p>
        </div>
      </motion.div>

      {/* Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="profile" className="w-full">
          <div className="relative">
            <TabsList className="w-full h-auto flex sm:flex-row p-1">
              <TabsTrigger
                value="profile"
                className="px-4 py-2.5 flex-1 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <User className="w-4 h-4" />
                <span className="max-sm:hidden">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="px-4 py-2.5 flex-1 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <Bell className="w-4 h-4" />
                <span className="max-sm:hidden">Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="company" 
                className="px-4 py-2.5 flex-1 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <Globe className="w-4 h-4" />
                <span className="max-sm:hidden">Company</span>
              </TabsTrigger>
              <TabsTrigger
                value="moderators"
                className="px-4 py-2.5 flex-1 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
              >
                <Shield className="w-4 h-4" />
                <span className="max-sm:hidden">Team</span>
              </TabsTrigger>
          </TabsList>
          </div>
          

          {/* Profile Settings */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Profile Information</span>
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and company details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileSettings.name}
                        onChange={(e) =>
                          setProfileSettings((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="glass-card"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileSettings.email}
                        onChange={(e) =>
                          setProfileSettings((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="glass-card"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={profileSettings.company}
                      onChange={(e) =>
                        setProfileSettings((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                      className="glass-card"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profileSettings.bio}
                      onChange={(e) =>
                        setProfileSettings((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      className="glass-card"
                      placeholder="Tell us about your business..."
                    />
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    className="bg-gold-gradient text-primary-foreground shadow-gold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            emailNotifications: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">Support Tickets</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new support tickets
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.supportTickets}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            supportTickets: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">
                          New User Registrations
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Alerts for new user sign-ups
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.newUsers}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            newUsers: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">
                          Payment Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Updates about payments and invoices
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.payments}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            payments: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base">System Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Maintenance and feature announcements
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) =>
                          setNotificationSettings((prev) => ({
                            ...prev,
                            systemUpdates: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveNotifications}
                    className="bg-gold-gradient text-primary-foreground shadow-gold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Moderators Management */}
          <TabsContent value="moderators">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span>Moderators</span>
                  </CardTitle>
                  <CardDescription>
                    Promote or demote moderators. Only admins can change roles.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="mod-name">Name</Label>
                      <Input
                        id="mod-name"
                        value={newModerator.name}
                        onChange={(e) =>
                          setNewModerator((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="glass-card"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="mod-email">Email</Label>
                      <Input
                        id="mod-email"
                        type="email"
                        value={newModerator.email}
                        onChange={(e) =>
                          setNewModerator((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="glass-card"
                        placeholder="user@xrt-tech.dev"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddModerator}
                    className="bg-gold-gradient text-primary-foreground shadow-gold"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Add Moderator
                  </Button>

                  <div className="space-y-3">
                    {moderators.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No moderators yet.
                      </p>
                    ) : (
                      moderators.map((m) => (
                        <div
                          key={m.email}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/20"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">
                              {m.name}
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {m.email}
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => handleRemoveModerator(m.email)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Company Settings */}
          <TabsContent value="company">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>
                    Update your company details that will be used in invoices and other documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={companySettings.companyName}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={companySettings.email}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={companySettings.address}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            address: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={companySettings.city}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        value={companySettings.state}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">ZIP/Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={companySettings.postalCode}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            postalCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={companySettings.phone}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            phone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID</Label>
                      <Input
                        id="taxId"
                        value={companySettings.taxId}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            taxId: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={companySettings.country}
                        onChange={(e) =>
                          setCompanySettings({
                            ...companySettings,
                            country: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleSaveCompanySettings}
                      disabled={saveStatus.type === 'success'}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {saveStatus.type === 'success' ? 'Saved!' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings;
