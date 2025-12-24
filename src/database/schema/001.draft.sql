-- The Schemas of Identity and Access Management 
-- ==============================================
-- ============== Identity Group ================
-- ==============================================
-- Bảng chính lưu ID và thông tin cơ bản.
CREATE TABLE IF NOT EXISTS lm_accounts();
-- Lưu các thông tin mở rộng (Metadata).
CREATE TABLE IF NOT EXISTS lm_account_attributes ();
-- Theo dõi lịch sử khóa/mở tài khoản.
CREATE TABLE IF NOT EXISTS lm_account_status_history();
-- Cấu hình các nguồn đăng nhập (Google, Facebook, LDAP).
CREATE TABLE IF NOT EXISTS lm_account_providers();
-- ===============================================
-- ======= Authentication & Security Group =======
-- ===============================================
-- Lưu mật khẩu (hash) cho đăng nhập truyền thống.
CREATE TABLE IF NOT EXISTS lm_login_data_internal ();
-- Lưu liên kết ID từ các Provider (Social ID).
CREATE TABLE IF NOT EXISTS lm_login_data_external ();
-- Quản lý phiên đăng nhập, thiết bị và token.
CREATE TABLE IF NOT EXISTS lm_sessions ();
-- Lưu cấu hình xác thực 2 lớp (2FA).
CREATE TABLE IF NOT EXISTS lm_otp_credentials();
-- Ngăn chặn việc đặt lại mật khẩu cũ.
CREATE TABLE IF NOT EXISTS lm_password_history();
-- ===============================================
-- ========= Authorization & RBAC Group ==========
-- ===============================================
-- Danh sách các vai trò.
CREATE TABLE IF NOT EXISTS lm_role();
-- Danh sách các hành động cụ thể.
CREATE TABLE IF NOT EXISTS lm_permission();
-- Ánh xạ quyền vào vai trò.
CREATE TABLE IF NOT EXISTS lm_role_permissions();
-- Cấu trúc tổ chức/phòng ban.
CREATE TABLE IF NOT EXISTS lm_groups();
-- Xếp người dùng vào nhóm.
CREATE TABLE IF NOT EXISTS lm_account_groups();
-- Gán quyền nhanh cho cả nhóm
CREATE TABLE IF NOT EXISTS lm_group_roles();
-- Gán quyền trực tiếp cho cá nhân
CREATE TABLE IF NOT EXISTS lm_account_roles();
-- ===============================================
-- ============= Client & OIDC Group =============
-- ===============================================
-- Lưu thông tin về các ứng dụng client đăng ký với hệ thống IAM
CREATE TABLE IF NOT EXISTS lm_clients();
-- Xác định phạm vi (scope) mà client có thể yêu cầu khi xin token.
CREATE TABLE IF NOT EXISTS lm_client_scopes();
-- Lưu danh sách các URI mà client được phép redirect sau khi xác thực
CREATE TABLE IF NOT EXISTS lm_client_redirect_uris();
-- Định nghĩa các ánh xạ dữ liệu người dùng (claims/attributes) vào token ID hoặc Access Token.
CREATE TABLE IF NOT EXISTS lm_protocol_mappers();
-- ===============================================
-- =============== Auditing Group ================
-- ===============================================
-- Ghi lại mọi hành động nhạy cảm (Ai, làm gì, khi nào, ở đâu).
CREATE TABLE IF NOT EXISTS lm_audit_logs();