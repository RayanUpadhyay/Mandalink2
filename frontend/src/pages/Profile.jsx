import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api.js'
import { AVATARS, avatarEmoji } from '../utils/avatars.js'
import { resizeImageFile } from '../utils/imageResize.js'
import BadgeIcon from '../components/BadgeIcon.jsx'
import './Profile.css'

export default function Profile({ user, onUsernameChanged, onAvatarChanged }) {
  const { username: routeUsername } = useParams()
  const isOwnProfile = !routeUsername || (user && routeUsername.toLowerCase() === user.username.toLowerCase())

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const [editingUsername, setEditingUsername] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [usernameBusy, setUsernameBusy] = useState(false)
  const [usernameMessage, setUsernameMessage] = useState(null)

  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)
  const [uploadMessage, setUploadMessage] = useState(null)
  const fileInputRef = useRef(null)

  const [editingBio, setEditingBio] = useState(false)
  const [newBio, setNewBio] = useState('')
  const [bioBusy, setBioBusy] = useState(false)
  const [bioMessage, setBioMessage] = useState(null)

  const load = () => {
    setLoading(true)
    const request = isOwnProfile ? api.getMyProfile() : api.getPublicProfile(routeUsername)
    request
      .then(setProfile)
      .catch(() => setProfile({ success: false }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [routeUsername])

  const submitUsername = async () => {
    setUsernameBusy(true)
    setUsernameMessage(null)
    try {
      const result = await api.changeUsername(newUsername)
      if (result.success) {
        onUsernameChanged(newUsername, result.newToken)
        setEditingUsername(false)
        load()
      } else {
        setUsernameMessage({ type: 'error', text: result.message })
      }
    } catch (e) {
      setUsernameMessage({ type: 'error', text: 'Could not reach the server.' })
    } finally {
      setUsernameBusy(false)
    }
  }

  const pickAvatar = async (id) => {
    setAvatarBusy(true)
    try {
      const result = await api.changeAvatar(id)
      if (result.success) {
        onAvatarChanged(id, null)
        setShowAvatarPicker(false)
        load()
      }
    } finally {
      setAvatarBusy(false)
    }
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    e.target.value = '' // allow re-selecting the same file later
    setAvatarBusy(true)
    setUploadMessage(null)
    try {
      const dataUri = await resizeImageFile(file)
      const result = await api.uploadAvatar(dataUri)
      setUploadMessage({ type: result.success ? 'success' : 'error', text: result.message })
      if (result.success) {
        setShowAvatarPicker(false)
        load()
      }
    } catch (err) {
      setUploadMessage({ type: 'error', text: 'Could not process that image.' })
    } finally {
      setAvatarBusy(false)
    }
  }

  const submitBio = async () => {
    setBioBusy(true)
    setBioMessage(null)
    try {
      const result = await api.changeBio(newBio)
      if (result.success) {
        setEditingBio(false)
        load()
      } else {
        setBioMessage({ type: 'error', text: result.message })
      }
    } catch (e) {
      setBioMessage({ type: 'error', text: 'Could not reach the server.' })
    } finally {
      setBioBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h2 className="page-h">Profile</h2>
        <p className="helper">Loading...</p>
      </div>
    )
  }

  if (!profile || !profile.success) {
    return (
      <div className="page">
        <h2 className="page-h">Profile</h2>
        <p className="helper">
          {isOwnProfile ? 'Could not load your profile. Try refreshing.' : "That user doesn't exist."}
        </p>
      </div>
    )
  }

  return (
    <div className="page">
      <h2 className="page-h">{isOwnProfile ? 'Profile' : `${profile.username}'s Profile`}</h2>
      <p className="helper">
        {isOwnProfile ? 'Your Mandalink identity, badges, and standing.' : 'Badges and standing on Mandalink.'}
      </p>

      <div className="card profile-card">
        <div className="profile-header">
          <div className="profile-avatar-wrap">
            <div
              className="profile-avatar"
              onClick={() => isOwnProfile && setShowAvatarPicker(s => !s)}
              style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}
            >
              {profile.avatarImage ? (
                <img src={profile.avatarImage} alt="" className="profile-avatar-img" />
              ) : (
                avatarEmoji(profile.avatar)
              )}
            </div>
            {isOwnProfile && <span className="profile-avatar-edit">Change</span>}
          </div>

          <div className="profile-header-info">
            {isOwnProfile && editingUsername ? (
              <div className="profile-username-edit">
                <input
                  className="profile-input"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="New username"
                  style={{ maxWidth: 220 }}
                />
                <button className="btn primary" disabled={usernameBusy} onClick={submitUsername}>
                  {usernameBusy ? 'Saving...' : 'Save'}
                </button>
                <button className="btn" onClick={() => { setEditingUsername(false); setUsernameMessage(null) }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="profile-username-row">
                <span className="profile-username">{profile.username}</span>
                {isOwnProfile && (
                  <button className="btn" onClick={() => { setEditingUsername(true); setNewUsername(profile.username) }}>
                    Edit
                  </button>
                )}
              </div>
            )}
            {usernameMessage && (
              <p className="helper" style={{ color: '#b3372a', margin: '6px 0 0' }}>{usernameMessage.text}</p>
            )}
            {isOwnProfile && <p className="helper" style={{ margin: '4px 0 0' }}>{profile.email}</p>}
          </div>
        </div>

        {isOwnProfile && profile.hasPendingAvatar && (
          <div className="profile-pending-notice">
            📷 Your uploaded photo is awaiting admin review — your current avatar still shows until then.
          </div>
        )}

        {isOwnProfile && showAvatarPicker && (
          <div className="avatar-picker-section">
            <div className="avatar-picker">
              {Object.entries(AVATARS).map(([id, emoji]) => (
                <button
                  key={id}
                  className={`avatar-option ${!profile.avatarImage && profile.avatar === id ? 'selected' : ''}`}
                  disabled={avatarBusy}
                  onClick={() => pickAvatar(id)}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="avatar-upload-row">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button className="btn" disabled={avatarBusy} onClick={() => fileInputRef.current.click()}>
                {avatarBusy ? 'Working...' : '📷 Upload your own photo'}
              </button>
              <span className="helper" style={{ margin: '6px 0 0' }}>
                Photos are reviewed by an admin before they go live.
              </span>
            </div>
            {uploadMessage && (
              <p className={`helper ${uploadMessage.type === 'error' ? 'profile-error-text' : ''}`} style={{ margin: '8px 0 0' }}>
                {uploadMessage.text}
              </p>
            )}
          </div>
        )}

        <div className="profile-stat-row">
          <div className="profile-stat">
            <div className="profile-stat-num">#{profile.rank}</div>
            <div className="profile-stat-label">of {profile.totalUsers} learners</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-num">{profile.xp}</div>
            <div className="profile-stat-label">Total XP</div>
          </div>
          <div className="profile-stat">
            <div className="profile-stat-num">{profile.level}</div>
            <div className="profile-stat-label">Level</div>
          </div>
        </div>
      </div>

      <div className="card profile-card" style={{ marginTop: 20 }}>
        <h3 style={{ margin: '0 0 14px' }}>About</h3>
        {isOwnProfile && editingBio ? (
          <div>
            <textarea
              className="profile-input profile-bio-textarea"
              value={newBio}
              onChange={e => setNewBio(e.target.value)}
              placeholder="Tell other learners a bit about yourself..."
              maxLength={300}
              rows={4}
            />
            <div className="profile-bio-footer">
              <span className="helper" style={{ margin: 0 }}>{newBio.length}/300</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => { setEditingBio(false); setBioMessage(null) }}>Cancel</button>
                <button className="btn primary" disabled={bioBusy} onClick={submitBio}>
                  {bioBusy ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            {bioMessage && (
              <p className="helper" style={{ color: '#b3372a', margin: '6px 0 0' }}>{bioMessage.text}</p>
            )}
          </div>
        ) : (
          <>
            {profile.bio ? (
              <p className="profile-bio-text">{profile.bio}</p>
            ) : (
              <p className="helper" style={{ margin: 0 }}>
                {isOwnProfile ? "You haven't written a bio yet." : `${profile.username} hasn't written a bio yet.`}
              </p>
            )}
            {isOwnProfile && (
              <button
                className="btn"
                style={{ marginTop: 12 }}
                onClick={() => { setEditingBio(true); setNewBio(profile.bio || ''); setBioMessage(null) }}
              >
                {profile.bio ? 'Edit bio' : 'Add a bio'}
              </button>
            )}
          </>
        )}
      </div>

      <div className="card profile-card" style={{ marginTop: 20 }}>
        <h3 style={{ margin: '0 0 14px' }}>Badges</h3>
        {profile.badges && profile.badges.length > 0 ? (
          <div className="profile-badges-row">
            {profile.badges.map((b, idx) => (
              <div key={idx} className="profile-badge-pill">
                <BadgeIcon icon={b.icon} name={b.name} description={b.description} />
                <span>{b.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="helper" style={{ margin: 0 }}>
            {isOwnProfile
              ? 'No badges yet — earn XP or catch a limited-time drop to start your collection.'
              : 'No badges yet.'}
          </p>
        )}
      </div>
    </div>
  )
}
