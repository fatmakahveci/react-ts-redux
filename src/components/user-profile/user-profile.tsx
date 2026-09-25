export default function UserProfile() {
  return (
    <section className="panel" aria-labelledby="profile-title">
      <h2 id="profile-title" tabIndex={-1}>My User Profile</h2>
      <p>You are exploring a demo session. No account was created.</p>
      <p className="help-text">Your counter stays the same when you sign out. Reloading starts a fresh demo.</p>
    </section>
  );
}
