// pages/Users.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosinstance";

function Users() {
  const storeUsers = useSelector((s) => s.user.allUsers);
  const isAdmin = useSelector((s) => s.user.isAdmin);
  const [users, setUsers] = useState(storeUsers || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUsers(storeUsers);
  }, [storeUsers]);

  useEffect(() => {
    // In case this page is opened directly
    async function ensureUsers() {
      if (!isAdmin) return; // guard
      if (users && users.length > 0) return;
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/admin/getUsers");
        setUsers(res.data || []);
      } catch (e) {
        console.error("Users fetch error", e);
      } finally {
        setLoading(false);
      }
    }
    ensureUsers();
  }, []); // eslint-disable-line

  if (!isAdmin) {
    return <div className="text-white p-6">Admins only.</div>;
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-auto rounded border border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-3 py-2 text-left">Username</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-700">
                  <td className="px-3 py-2">{u.username}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.role}</td>
                  <td className="px-3 py-2">
                    {new Date(u.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Users;
