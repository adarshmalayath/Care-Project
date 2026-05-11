package com.carehome.model;

public class EnquiryStats {
    private long totalEnquiries;
    private long pendingCount;
    private long repliedCount;
    private long discardedCount;
    private long driverCount;
    private long cookCount;
    private long careWorkerCount;
    private long otherCount;

    public EnquiryStats() {}

    public long getTotalEnquiries() { return totalEnquiries; }
    public void setTotalEnquiries(long totalEnquiries) { this.totalEnquiries = totalEnquiries; }

    public long getPendingCount() { return pendingCount; }
    public void setPendingCount(long pendingCount) { this.pendingCount = pendingCount; }

    public long getRepliedCount() { return repliedCount; }
    public void setRepliedCount(long repliedCount) { this.repliedCount = repliedCount; }

    public long getDiscardedCount() { return discardedCount; }
    public void setDiscardedCount(long discardedCount) { this.discardedCount = discardedCount; }

    public long getDriverCount() { return driverCount; }
    public void setDriverCount(long driverCount) { this.driverCount = driverCount; }

    public long getCookCount() { return cookCount; }
    public void setCookCount(long cookCount) { this.cookCount = cookCount; }

    public long getCareWorkerCount() { return careWorkerCount; }
    public void setCareWorkerCount(long careWorkerCount) { this.careWorkerCount = careWorkerCount; }

    public long getOtherCount() { return otherCount; }
    public void setOtherCount(long otherCount) { this.otherCount = otherCount; }
}
