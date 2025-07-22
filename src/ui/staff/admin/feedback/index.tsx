import {
  Star,
  ThumbUp,
  ThumbDown,
  FilterList,
  Reply,
  MarkEmailRead,
  Flag,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Divider,
  Badge,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock feedback data
const mockFeedbackData = {
  overview: {
    totalFeedbacks: 342,
    averageRating: 4.6,
    positivePercentage: 85,
    negativePercentage: 15,
    responseRate: 78,
    trendChange: 8.5,
  },
  feedbacks: [
    {
      id: 1,
      customerName: "Sarah Johnson",
      rating: 5,
      comment: "Absolutely amazing food and service! The salmon was perfectly cooked and our waiter was very attentive. Will definitely come back!",
      date: "2024-07-21",
      time: "7:30 PM",
      table: "A-12",
      waiter: "Mike Chen",
      dish: "Grilled Salmon",
      status: "unread",
      category: "positive",
      orderValue: 125.50,
    },
    {
      id: 2,
      customerName: "David Wilson",
      rating: 2,
      comment: "The food took way too long to arrive and when it did, it was cold. The pasta was overcooked and the service was slow. Very disappointing experience.",
      date: "2024-07-21",
      time: "6:45 PM",
      table: "B-08",
      waiter: "Lisa Garcia",
      dish: "Pasta Carbonara",
      status: "unread",
      category: "negative",
      orderValue: 89.25,
    },
    {
      id: 3,
      customerName: "Emily Davis",
      rating: 4,
      comment: "Good food overall. The burger was tasty but could use more seasoning. Great atmosphere and friendly staff.",
      date: "2024-07-21",
      time: "5:20 PM",
      table: "C-15",
      waiter: "Mike Chen",
      dish: "Beef Burger",
      status: "read",
      category: "positive",
      orderValue: 67.80,
    },
    {
      id: 4,
      customerName: "James Brown",
      rating: 5,
      comment: "Exceptional dining experience! Everything was perfect from start to finish. The chef's special was incredible.",
      date: "2024-07-20",
      time: "8:15 PM",
      table: "A-05",
      waiter: "Sarah Johnson",
      dish: "Chef's Special",
      status: "replied",
      category: "positive",
      orderValue: 156.90,
    },
    {
      id: 5,
      customerName: "Maria Garcia",
      rating: 1,
      comment: "Terrible experience. The food was burnt, the service was rude, and the place was dirty. Won't be coming back.",
      date: "2024-07-20",
      time: "7:00 PM",
      table: "B-12",
      waiter: "David Park",
      dish: "Caesar Salad",
      status: "flagged",
      category: "negative",
      orderValue: 45.20,
    },
  ],
  ratingDistribution: [
    { rating: 5, count: 156, percentage: 45.6 },
    { rating: 4, count: 98, percentage: 28.7 },
    { rating: 3, count: 42, percentage: 12.3 },
    { rating: 2, count: 28, percentage: 8.2 },
    { rating: 1, count: 18, percentage: 5.3 },
  ],
  topComplaints: [
    { issue: "Slow Service", count: 23, trend: -5 },
    { issue: "Food Temperature", count: 18, trend: 12 },
    { issue: "Order Accuracy", count: 15, trend: -8 },
    { issue: "Staff Attitude", count: 12, trend: 3 },
  ],
  staffRatings: [
    { name: "Mike Chen", rating: 4.8, feedbacks: 45 },
    { name: "Sarah Johnson", rating: 4.7, feedbacks: 38 },
    { name: "Lisa Garcia", rating: 4.6, feedbacks: 42 },
    { name: "David Park", rating: 4.3, feedbacks: 35 },
  ],
};

const FeedbackCard: FC<{
  feedback: any;
  onReply: (id: number) => void;
  onFlag: (id: number) => void;
  onMarkRead: (id: number) => void;
}> = ({ feedback, onReply, onFlag, onMarkRead }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread": return "warning";
      case "read": return "info";
      case "replied": return "success";
      case "flagged": return "error";
      default: return "default";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "error";
  };

  return (
    <Card sx={{ mb: 2, border: feedback.status === "unread" ? "2px solid" : "1px solid", borderColor: feedback.status === "unread" ? "warning.main" : "divider" }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {feedback.customerName.split(" ").map((n: string) => n[0]).join("")}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="medium">
                {feedback.customerName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {feedback.date} • {feedback.time} • Table {feedback.table}
              </Typography>
            </Box>
          </Stack>
          <Stack alignItems="flex-end" spacing={1}>
            <Rating value={feedback.rating} readOnly size="small" />
            <Chip
              label={feedback.status}
              color={getStatusColor(feedback.status) as any}
              size="small"
            />
          </Stack>
        </Stack>

        <Typography variant="body1" paragraph sx={{ fontStyle: "italic", px: 1, py: 1, bgcolor: "grey.50", borderRadius: 1 }}>
          "{feedback.comment}"
        </Typography>

        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="caption" color="text.secondary">
              <strong>Dish:</strong> {feedback.dish}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <strong>Waiter:</strong> {feedback.waiter}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              <strong>Order:</strong> ${feedback.orderValue}
            </Typography>
          </Stack>
          <Chip
            label={`${feedback.rating}/5`}
            color={getRatingColor(feedback.rating)}
            size="small"
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" spacing={1}>
          {feedback.status === "unread" && (
            <Button
              size="small"
              startIcon={<MarkEmailRead />}
              onClick={() => onMarkRead(feedback.id)}
            >
              Mark Read
            </Button>
          )}
          {feedback.status !== "replied" && (
            <Button
              size="small"
              startIcon={<Reply />}
              onClick={() => onReply(feedback.id)}
            >
              Reply
            </Button>
          )}
          {feedback.status !== "flagged" && feedback.rating <= 2 && (
            <Button
              size="small"
              color="error"
              startIcon={<Flag />}
              onClick={() => onFlag(feedback.id)}
            >
              Flag
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const Admin_FeedbackPage: FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [replyDialog, setReplyDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [replyText, setReplyText] = useState("");

  const data = mockFeedbackData;

  const filteredFeedbacks = data.feedbacks.filter((feedback) => {
    const statusMatch = filterStatus === "all" || feedback.status === filterStatus;
    const ratingMatch = filterRating === "all" || feedback.rating.toString() === filterRating;
    return statusMatch && ratingMatch;
  });

  const handleReply = (id: number) => {
    const feedback = data.feedbacks.find(f => f.id === id);
    setSelectedFeedback(feedback);
    setReplyDialog(true);
  };

  const handleSendReply = () => {
    // Handle reply logic here
    console.log("Sending reply:", replyText);
    setReplyDialog(false);
    setReplyText("");
    setSelectedFeedback(null);
  };

  const handleFlag = (id: number) => {
    console.log("Flagging feedback:", id);
  };

  const handleMarkRead = (id: number) => {
    console.log("Marking as read:", id);
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Customer Feedback
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor and respond to customer reviews and feedback
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate("/staff/admin")}>
          Back to Dashboard
        </Button>
      </Stack>

      {/* Overview Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {data.overview.totalFeedbacks}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Reviews
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "primary.light" }}>
                  <Star />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {data.overview.averageRating}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Rating
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="caption" color="success.main">
                      +{data.overview.trendChange}% this month
                    </Typography>
                  </Stack>
                </Box>
                <Avatar sx={{ bgcolor: "warning.light" }}>
                  <Star />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {data.overview.positivePercentage}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Positive Reviews
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "success.light" }}>
                  <ThumbUp />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {data.overview.responseRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Response Rate
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: "info.light" }}>
                  <Reply />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="All Feedback" />
        <Tab label="Analytics" />
        <Tab label="Staff Ratings" />
      </Tabs>

      {/* All Feedback Tab */}
      {activeTab === 0 && (
        <>
          {/* Filters */}
          <Stack direction="row" spacing={2} mb={3}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="unread">Unread</MenuItem>
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="replied">Replied</MenuItem>
                <MenuItem value="flagged">Flagged</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Rating</InputLabel>
              <Select
                value={filterRating}
                label="Rating"
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <MenuItem value="all">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4 Stars</MenuItem>
                <MenuItem value="3">3 Stars</MenuItem>
                <MenuItem value="2">2 Stars</MenuItem>
                <MenuItem value="1">1 Star</MenuItem>
              </Select>
            </FormControl>
            <Badge badgeContent={data.feedbacks.filter(f => f.status === "unread").length} color="warning">
              <Button variant="outlined" startIcon={<FilterList />}>
                Showing {filteredFeedbacks.length} reviews
              </Button>
            </Badge>
          </Stack>

          {/* Feedback List */}
          <Box>
            {filteredFeedbacks.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No feedback matches your filters
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search criteria
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  onReply={handleReply}
                  onFlag={handleFlag}
                  onMarkRead={handleMarkRead}
                />
              ))
            )}
          </Box>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Rating Distribution
                </Typography>
                <Stack spacing={2} mt={2}>
                  {data.ratingDistribution.map((rating) => (
                    <Stack key={rating.rating} direction="row" alignItems="center" spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" sx={{ minWidth: 20 }}>
                          {rating.rating}
                        </Typography>
                        <Star fontSize="small" sx={{ color: "warning.main" }} />
                      </Stack>
                      <Box sx={{ flex: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={rating.percentage}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 60 }}>
                        {rating.count} ({rating.percentage}%)
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Top Complaints
                </Typography>
                <Stack spacing={2} mt={2}>
                  {data.topComplaints.map((complaint, index) => (
                    <Box key={index}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body1" fontWeight="medium">
                          {complaint.issue}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2" color="text.secondary">
                            {complaint.count} reports
                          </Typography>
                          <Chip
                            label={`${complaint.trend > 0 ? "+" : ""}${complaint.trend}%`}
                            size="small"
                            color={complaint.trend > 0 ? "error" : "success"}
                          />
                        </Stack>
                      </Stack>
                      {index < data.topComplaints.length - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Staff Ratings Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Staff Performance by Customer Feedback
                </Typography>
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Staff Member</TableCell>
                        <TableCell align="center">Average Rating</TableCell>
                        <TableCell align="center">Total Feedbacks</TableCell>
                        <TableCell align="center">Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.staffRatings.map((staff, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar sx={{ bgcolor: "primary.main" }}>
                                {staff.name.split(" ").map(n => n[0]).join("")}
                              </Avatar>
                              <Typography variant="body1" fontWeight="medium">
                                {staff.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                              <Star fontSize="small" sx={{ color: "warning.main" }} />
                              <Typography variant="body1" fontWeight="medium">
                                {staff.rating}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1">
                              {staff.feedbacks}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={staff.rating >= 4.7 ? "Excellent" : staff.rating >= 4.5 ? "Good" : "Needs Improvement"}
                              color={staff.rating >= 4.7 ? "success" : staff.rating >= 4.5 ? "primary" : "warning"}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Reply Dialog */}
      <Dialog open={replyDialog} onClose={() => setReplyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Reply to {selectedFeedback?.customerName}
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box mb={2}>
              <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                <Rating value={selectedFeedback.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">
                  {selectedFeedback.date} • Table {selectedFeedback.table}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ fontStyle: "italic", bgcolor: "grey.100", p: 2, borderRadius: 1 }}>
                "{selectedFeedback.comment}"
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Response"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Thank you for your feedback. We appreciate your input and will use it to improve our service..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(false)}>Cancel</Button>
          <Button onClick={handleSendReply} variant="contained" disabled={!replyText.trim()}>
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 