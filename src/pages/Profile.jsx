
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Heart,
  MapPin,
  LogOut,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Camera,
  Mail,
  Phone,
  AlertTriangle,
} from "lucide-react";

const getProfileKey = (email) =>
  `meesho_profile_${String(email || "").trim().toLowerCase()}`;

function Profile({
  user,
  setUser,
  cart = [],
  setCart,
  wishlist = [],
  handleLogout: appLogout,
  onClose,
}) {
  const [addresses, setAddresses] = useState([]);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [editId, setEditId] = useState(null);
  const [photo, setPhoto] = useState("");
  const [editingField, setEditingField] = useState("");
  const [fieldValue, setFieldValue] = useState("");

  const emptyAddress = {
    fullName: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    area: "",
    landmark: "",
    addressType: "Home",
  };

  const [formData, setFormData] = useState(emptyAddress);

  const emailKey = user?.email?.trim().toLowerCase() || "";

  const addressKey = emailKey
    ? `addressBook_${emailKey}`
    : "addressBook_guest";

  const photoKey = emailKey
    ? `meesho_profile_photo_${emailKey}`
    : null;

  const contactNumber =
    user?.phone ||
    user?.contactNo ||
    user?.mobile ||
    user?.mobileNumber ||
    user?.contact ||
    "";

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  // SAVE PROFILE DATA
  const saveProfileData = (updatedUser) => {
    const email = updatedUser?.email?.trim().toLowerCase();

    if (!email) return;

    const profileData = {
      name: updatedUser.name || "",
      email: updatedUser.email || "",
      phone:
        updatedUser.phone ||
        updatedUser.contactNo ||
        updatedUser.mobile ||
        updatedUser.mobileNumber ||
        "",
      profilePhoto: updatedUser.profilePhoto || photo || "",
    };

    localStorage.setItem(
      getProfileKey(email),
      JSON.stringify(profileData)
    );
  };

  // LOAD ADDRESS BOOK
  useEffect(() => {
    if (!user) {
      setAddresses([]);
      return;
    }

    try {
      const saved = JSON.parse(
        localStorage.getItem(addressKey) || "[]"
      );

      setAddresses(Array.isArray(saved) ? saved : []);
    } catch {
      setAddresses([]);
    }
  }, [addressKey, user]);

  // LOAD PROFILE PHOTO
  useEffect(() => {
    if (!photoKey) {
      setPhoto(user?.profilePhoto || "");
      return;
    }

    const savedPhoto =
      localStorage.getItem(photoKey) ||
      user?.profilePhoto ||
      "";

    setPhoto(savedPhoto);
  }, [photoKey, user?.profilePhoto]);

  // LOCK BACKGROUND SCROLL
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // ESCAPE KEY
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key !== "Escape") return;

      if (showLogoutConfirm) {
        setShowLogoutConfirm(false);
      } else if (showForm) {
        handleCloseForm();
      } else if (editingField) {
        setEditingField("");
        setFieldValue("");
      } else {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showLogoutConfirm, showForm, editingField, onClose]);

  // SAVE ADDRESSES
  const saveAddresses = (updated) => {
    setAddresses(updated);
    localStorage.setItem(addressKey, JSON.stringify(updated));
  };

  // PROFILE PHOTO UPLOAD
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please select an image smaller than 2 MB.");
      e.target.value = "";
      return;
    }

    if (!emailKey) {
      alert("Please login before uploading a photo.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      try {
        localStorage.setItem(photoKey, imageData);
        setPhoto(imageData);

        const updatedUser = {
          ...user,
          profilePhoto: imageData,
        };

        setUser?.(updatedUser);

        localStorage.setItem(
          "meesho_user",
          JSON.stringify(updatedUser)
        );

        saveProfileData(updatedUser);
      } catch (error) {
        console.error("Photo save error:", error);
        alert("Could not save photo. Please choose a smaller image.");
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // EDIT PROFILE FIELD
  const handleProfileFieldEdit = (field) => {
    setEditingField(field);

    if (field === "name") {
      setFieldValue(user?.name || "");
    } else if (field === "email") {
      setFieldValue(user?.email || "");
    } else if (field === "phone") {
      setFieldValue(contactNumber);
    }
  };

  // SAVE PROFILE FIELD
  const handleSaveProfileField = () => {
    const value = fieldValue.trim();

    if (!value) {
      alert("Please enter your details.");
      return;
    }

    if (editingField === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(value)) {
        alert("Please enter a valid email address.");
        return;
      }
    }

    if (
      editingField === "phone" &&
      !/^[6-9]\d{9}$/.test(value)
    ) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const oldEmail = user?.email?.trim().toLowerCase() || "";

    const updatedUser = {
      ...user,
      [editingField]: value,
    };

    const newEmail =
      updatedUser.email?.trim().toLowerCase() || "";

    // MOVE DATA WHEN EMAIL CHANGES
    if (oldEmail && newEmail && oldEmail !== newEmail) {
      const oldProfileKey = getProfileKey(oldEmail);
      const newProfileKey = getProfileKey(newEmail);

      const oldAddressKey = `addressBook_${oldEmail}`;
      const newAddressKey = `addressBook_${newEmail}`;

      const oldPhotoKey = `meesho_profile_photo_${oldEmail}`;
      const newPhotoKey = `meesho_profile_photo_${newEmail}`;

      const oldProfile = localStorage.getItem(oldProfileKey);
      const oldAddresses = localStorage.getItem(oldAddressKey);
      const oldPhoto = localStorage.getItem(oldPhotoKey);

      if (oldProfile) {
        const parsedProfile = JSON.parse(oldProfile);

        localStorage.setItem(
          newProfileKey,
          JSON.stringify({
            ...parsedProfile,
            ...updatedUser,
            email: newEmail,
          })
        );
      }

      if (
        oldAddresses &&
        !localStorage.getItem(newAddressKey)
      ) {
        localStorage.setItem(newAddressKey, oldAddresses);
      }

      if (oldPhoto) {
        localStorage.setItem(newPhotoKey, oldPhoto);
      }
    }

    setUser?.(updatedUser);

    localStorage.setItem(
      "meesho_user",
      JSON.stringify(updatedUser)
    );

    saveProfileData(updatedUser);

    setEditingField("");
    setFieldValue("");
  };

  // ADDRESS INPUT
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ADD ADDRESS
  const handleAddNew = () => {
    setEditId(null);

    setFormData({
      ...emptyAddress,
      fullName: user?.name || "",
      phone: contactNumber || "",
    });

    setShowForm(true);
  };

  // EDIT ADDRESS
  const handleEdit = (address) => {
    setEditId(address.id);

    setFormData({
      ...emptyAddress,
      ...address,
    });

    setShowForm(true);
  };

  // SAVE ADDRESS
  const handleSaveAddress = (e) => {
    e.preventDefault();

    const addressData = {
      ...formData,
      id: editId || Date.now(),
      isDefault: editId
        ? addresses.find((a) => a.id === editId)?.isDefault || false
        : addresses.length === 0,
    };

    const updated = editId
      ? addresses.map((address) =>
          address.id === editId ? addressData : address
        )
      : [...addresses, addressData];

    saveAddresses(updated);
    handleCloseForm();
  };

  // DELETE ADDRESS
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to remove this address?")) {
      return;
    }

    let updated = addresses.filter(
      (address) => address.id !== id
    );

    if (
      updated.length > 0 &&
      !updated.some((address) => address.isDefault)
    ) {
      updated = updated.map((address, index) => ({
        ...address,
        isDefault: index === 0,
      }));
    }

    saveAddresses(updated);
  };

  // SET DEFAULT ADDRESS
  const handleSetDefault = (id) => {
    const updated = addresses.map((address) => ({
      ...address,
      isDefault: address.id === id,
    }));

    saveAddresses(updated);
  };

  // CLOSE ADDRESS FORM
  const handleCloseForm = () => {
    setShowForm(false);
    setEditId(null);
    setFormData(emptyAddress);
  };

  // LOGOUT
  const handleConfirmLogout = () => {
    if (appLogout) {
      appLogout();
    } else {
      setCart?.([]);
      localStorage.removeItem("meesho_cart");
      setUser?.(null);
    }

    setShowLogoutConfirm(false);
    onClose?.();
  };

  // PROFILE FIELDS
  const profileFields = [
    {
      key: "name",
      label: "Full Name",
      value: user?.name || "",
      icon: <UserRound size={20} />,
      placeholder: "Enter your full name",
      type: "text",
    },
    {
      key: "email",
      label: "Email Address",
      value: user?.email || "",
      icon: <Mail size={20} />,
      placeholder: "Enter your email address",
      type: "email",
    },
    {
      key: "phone",
      label: "Mobile Number",
      value: contactNumber,
      icon: <Phone size={20} />,
      placeholder: "Enter 10 digit mobile number",
      type: "tel",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 backdrop-blur-sm sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          if (showLogoutConfirm) {
            setShowLogoutConfirm(false);
          } else if (showForm) {
            handleCloseForm();
          } else {
            onClose?.();
          }
        }
      }}
    >
      <div className="relative max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:p-7">

        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-pink-600">
              MY ACCOUNT
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
              My Account
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2.5 text-gray-600 hover:bg-pink-50 hover:text-pink-600"
          >
            <X size={21} />
          </button>
        </div>

        {!user ? (
          <div className="py-8 text-center">

            {/* MEESHO LOGO INSIDE ROUNDED CIRCLE */}
            <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-pink-100 bg-pink-50 shadow-sm">
              <img
                src="\assets\image.png"
                alt="Meesho Logo"
                className="h-20 w-20 rounded-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900">
              Welcome to Meesho!
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Please login to view your account details.
            </p>

            <Link
              to="/login"
              onClick={onClose}
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3.5 font-bold text-white hover:bg-pink-700"
            >
              Login / Sign up
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            {/* ACCOUNT STATUS */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <button
                type="button"
                onClick={() =>
                  setShowAccountDetails((prev) => !prev)
                }
                className="flex w-full items-center gap-4 p-5 text-left hover:bg-pink-50/40 sm:p-6"
              >
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-pink-100 bg-pink-50 text-2xl font-extrabold text-pink-600">
                  {photo ? (
                    <img
                      src={photo}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initial
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-extrabold text-gray-900">
                    {user.name || "User"}
                  </h3>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {user.email || "Email not available"}
                  </p>

                  <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-green-600">
                    <CheckCircle2 size={17} />
                    Active
                  </p>
                </div>

                {showAccountDetails ? (
                  <ChevronUp size={22} className="text-pink-600" />
                ) : (
                  <ChevronDown size={22} className="text-gray-400" />
                )}
              </button>

              {showAccountDetails && (
                <div className="border-t border-gray-100 bg-gray-50 p-5 sm:p-6">
                  <h3 className="mb-5 text-lg font-extrabold text-gray-900">
                    Account Details
                  </h3>

                  {/* PROFILE PHOTO */}
                  <div className="mb-6 flex flex-col items-center">
                    <div className="relative">
                      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-pink-100 text-3xl font-extrabold text-pink-600 shadow-md">
                        {photo ? (
                          <img
                            src={photo}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          initial
                        )}
                      </div>

                      <label
                        htmlFor="profilePhotoUpload"
                        className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-pink-600 text-white shadow-md hover:bg-pink-700"
                      >
                        <Camera size={17} />
                      </label>

                      <input
                        id="profilePhotoUpload"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>

                    <label
                      htmlFor="profilePhotoUpload"
                      className="mt-3 cursor-pointer rounded-lg border border-pink-200 bg-white px-4 py-2 text-sm font-bold text-pink-600 hover:bg-pink-50"
                    >
                      <span className="flex items-center gap-2">
                        <Camera size={16} />
                        {photo
                          ? "Change Profile Photo"
                          : "Upload Profile Photo"}
                      </span>
                    </label>

                    <p className="mt-2 text-xs text-gray-400">
                      JPG, PNG or WEBP · Maximum 2 MB
                    </p>
                  </div>

                  {/* PROFILE FIELDS */}
                  {profileFields.map((field) => (
                    <div
                      key={field.key}
                      className="mb-3 rounded-xl border border-gray-100 bg-white p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-pink-50 p-2.5 text-pink-600">
                          {field.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-400">
                            {field.label}
                          </p>

                          <p className="mt-1 break-all font-bold text-gray-900">
                            {field.value || "Not added yet"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleProfileFieldEdit(field.key)
                          }
                          className="shrink-0 rounded-lg border border-pink-200 px-3 py-2 text-xs font-bold text-pink-600 hover:bg-pink-50"
                        >
                          {field.value ? "Edit" : "Add"}
                        </button>
                      </div>

                      {editingField === field.key && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <label className="mb-2 block text-sm font-semibold text-gray-700">
                            {field.label}
                          </label>

                          <input
                            type={field.type}
                            value={fieldValue}
                            onChange={(e) =>
                              setFieldValue(e.target.value)
                            }
                            placeholder={field.placeholder}
                            maxLength={
                              field.key === "phone" ? 10 : undefined
                            }
                            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                          />

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingField("");
                                setFieldValue("");
                              }}
                              className="flex-1 rounded-lg border border-gray-300 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={handleSaveProfileField}
                              className="flex-1 rounded-lg bg-pink-600 py-2.5 text-sm font-bold text-white hover:bg-pink-700"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">
                    <ShieldCheck size={16} />
                    Your account information is saved
                  </div>
                </div>
              )}
            </section>

            {/* MY ACTIVITIES */}
            <section className="mt-6">
              <h3 className="mb-3 text-lg font-extrabold text-gray-900">
                My Activities
              </h3>

              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <Link
                  to="/my-orders"
                  onClick={onClose}
                  className="group flex items-center gap-4 border-b border-gray-100 p-5 hover:bg-pink-50/50"
                >
                  <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
                    <Package size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900">
                      My Orders
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      View your order history and details
                    </p>
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-gray-400 group-hover:text-pink-600"
                  />
                </Link>

                <Link
                  to="/wishlist"
                  onClick={onClose}
                  className="group flex items-center gap-4 border-b border-gray-100 p-5 hover:bg-pink-50/50"
                >
                  <div className="rounded-xl bg-rose-50 p-3 text-rose-600">
                    <Heart size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900">
                      My Wishlist
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {wishlist.length} saved products
                    </p>
                  </div>

                  <ArrowRight
                    size={20}
                    className="text-gray-400 group-hover:text-pink-600"
                  />
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddressBook((prev) => !prev)
                  }
                  className="flex w-full items-center gap-4 p-5 text-left hover:bg-pink-50/50"
                >
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <MapPin size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900">
                      Address Book
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      {addresses.length} saved address(es)
                    </p>
                  </div>

                  {showAddressBook ? (
                    <ChevronUp size={20} className="text-pink-600" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>

                {/* ADDRESS LIST */}
                {showAddressBook && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4 sm:p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-gray-900">
                          Saved Addresses
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">
                          Manage your delivery addresses.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAddNew}
                        className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-pink-700"
                      >
                        <Plus size={17} />
                        Add New
                      </button>
                    </div>

                    {addresses.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-8 text-center">
                        <MapPin
                          size={32}
                          className="mx-auto text-gray-300"
                        />
                        <p className="mt-3 font-semibold text-gray-700">
                          No saved addresses yet
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Add your first delivery address.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`rounded-xl border bg-white p-4 ${
                              address.isDefault
                                ? "border-pink-300"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700">
                                {address.addressType}
                              </span>

                              {address.isDefault && (
                                <span className="flex items-center gap-1 text-xs font-bold text-pink-600">
                                  <Star size={13} fill="currentColor" />
                                  Default
                                </span>
                              )}
                            </div>

                            <h4 className="mt-3 font-bold text-gray-900">
                              {address.fullName}
                            </h4>

                            <p className="mt-1 text-sm leading-6 text-gray-600">
                              {address.area}, {address.city},{" "}
                              {address.state} - {address.pincode}
                              {address.landmark &&
                                `, Near ${address.landmark}`}
                            </p>

                            <p className="mt-2 text-sm font-semibold text-gray-700">
                              Phone: {address.phone}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-3">
                              {!address.isDefault && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleSetDefault(address.id)
                                  }
                                  className="text-xs font-bold text-pink-600 hover:underline"
                                >
                                  Set as Default
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleEdit(address)}
                                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                              >
                                <Pencil size={13} />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(address.id)
                                }
                                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
                              >
                                <Trash2 size={13} />
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* LOGOUT */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3.5 font-bold text-red-500 hover:bg-red-50"
              >
                <LogOut size={19} />
                Logout
              </button>
            </div>
          </>
        )}
      </div>

      {/* ADDRESS FORM */}
      {showForm && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-3 sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseForm();
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:p-7">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900">
                {editId ? "Edit Address" : "Add New Address"}
              </h2>

              <button
                type="button"
                onClick={handleCloseForm}
                className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Mobile Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                  placeholder="10 digit mobile number"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    PIN Code
                  </label>
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                    placeholder="6 digit PIN"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-gray-700">
                    State
                  </label>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                    placeholder="State"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Area / House No. / Street
                </label>
                <textarea
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                  placeholder="House number, street, area"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-gray-700">
                  Landmark (Optional)
                </label>
                <input
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-pink-500"
                  placeholder="Nearby landmark"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Address Type
                </label>

                <div className="flex flex-wrap gap-3">
                  {["Home", "Work", "Other"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          addressType: type,
                        }))
                      }
                      className={`rounded-lg border px-4 py-2 text-sm font-semibold ${
                        formData.addressType === type
                          ? "border-pink-600 bg-pink-50 text-pink-600"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 rounded-xl border border-gray-300 py-3 font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-pink-600 py-3 font-bold text-white hover:bg-pink-700"
                >
                  {editId ? "Update Address" : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowLogoutConfirm(false);
            }
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl sm:p-7">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle size={32} />
            </div>

            <h3 className="text-xl font-extrabold text-gray-900">
              Confirm Logout
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to logout from your account?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
