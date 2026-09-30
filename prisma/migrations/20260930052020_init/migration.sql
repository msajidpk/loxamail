-- CreateTable
CREATE TABLE `CustomerAccount` (
    `id` VARCHAR(36) NOT NULL,
    `type` ENUM('COMPANY', 'INDIVIDUAL') NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Contact_customerAccountId_idx`(`customerAccountId`),
    INDEX `Contact_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerMembership` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NOT NULL,
    `roleId` VARCHAR(36) NULL,
    `status` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CustomerMembership_customerAccountId_idx`(`customerAccountId`),
    INDEX `CustomerMembership_roleId_idx`(`roleId`),
    UNIQUE INDEX `CustomerMembership_userId_customerAccountId_key`(`userId`, `customerAccountId`),
    UNIQUE INDEX `CustomerMembership_id_userId_key`(`id`, `userId`),
    UNIQUE INDEX `CustomerMembership_id_userId_customerAccountId_key`(`id`, `userId`, `customerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(36) NOT NULL,
    `key` VARCHAR(100) NOT NULL,
    `scope` ENUM('CUSTOMER', 'INTERNAL') NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InternalRoleAssignment` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `roleId` VARCHAR(36) NOT NULL,

    INDEX `InternalRoleAssignment_roleId_idx`(`roleId`),
    UNIQUE INDEX `InternalRoleAssignment_userId_roleId_key`(`userId`, `roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `customerAccountId` VARCHAR(36) NULL,
    `contactId` VARCHAR(36) NULL,
    `ownerUserId` VARCHAR(36) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Lead_customerAccountId_idx`(`customerAccountId`),
    INDEX `Lead_contactId_idx`(`contactId`),
    INDEX `Lead_ownerUserId_idx`(`ownerUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Opportunity` (
    `id` VARCHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `leadId` VARCHAR(36) NULL,
    `customerAccountId` VARCHAR(36) NULL,
    `contactId` VARCHAR(36) NULL,
    `ownerUserId` VARCHAR(36) NULL,
    `estimatedValue` DECIMAL(65, 30) NULL,
    `currency` VARCHAR(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Opportunity_leadId_idx`(`leadId`),
    INDEX `Opportunity_customerAccountId_idx`(`customerAccountId`),
    INDEX `Opportunity_contactId_idx`(`contactId`),
    INDEX `Opportunity_ownerUserId_idx`(`ownerUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activity` (
    `id` VARCHAR(36) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `activityType` VARCHAR(100) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `dueAt` DATETIME(3) NULL,
    `assignedUserId` VARCHAR(36) NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Activity_assignedUserId_idx`(`assignedUserId`),
    INDEX `Activity_dueAt_idx`(`dueAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityContext` (
    `id` VARCHAR(36) NOT NULL,
    `activityId` VARCHAR(36) NOT NULL,
    `leadId` VARCHAR(36) NULL,
    `opportunityId` VARCHAR(36) NULL,
    `customerAccountId` VARCHAR(36) NULL,
    `contactId` VARCHAR(36) NULL,
    `quoteId` VARCHAR(36) NULL,
    `orderId` VARCHAR(36) NULL,
    `ticketId` VARCHAR(36) NULL,

    INDEX `ActivityContext_activityId_idx`(`activityId`),
    INDEX `ActivityContext_leadId_idx`(`leadId`),
    INDEX `ActivityContext_opportunityId_idx`(`opportunityId`),
    INDEX `ActivityContext_customerAccountId_idx`(`customerAccountId`),
    INDEX `ActivityContext_contactId_idx`(`contactId`),
    INDEX `ActivityContext_quoteId_idx`(`quoteId`),
    INDEX `ActivityContext_orderId_idx`(`orderId`),
    INDEX `ActivityContext_ticketId_idx`(`ticketId`),
    UNIQUE INDEX `ActivityContext_activityId_leadId_key`(`activityId`, `leadId`),
    UNIQUE INDEX `ActivityContext_activityId_opportunityId_key`(`activityId`, `opportunityId`),
    UNIQUE INDEX `ActivityContext_activityId_customerAccountId_key`(`activityId`, `customerAccountId`),
    UNIQUE INDEX `ActivityContext_activityId_contactId_key`(`activityId`, `contactId`),
    UNIQUE INDEX `ActivityContext_activityId_quoteId_key`(`activityId`, `quoteId`),
    UNIQUE INDEX `ActivityContext_activityId_orderId_key`(`activityId`, `orderId`),
    UNIQUE INDEX `ActivityContext_activityId_ticketId_key`(`activityId`, `ticketId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(36) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(100) NULL,
    `status` VARCHAR(50) NOT NULL,
    `provisioningCategory` ENUM('EXTERNAL_PROVIDER', 'INTERNAL_MANUAL', 'HYBRID', 'FUTURE_INTEGRATION') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Product_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductCommercialProfileVersion` (
    `id` VARCHAR(36) NOT NULL,
    `productId` VARCHAR(36) NOT NULL,
    `effectiveFrom` DATETIME(3) NOT NULL,
    `effectiveTo` DATETIME(3) NULL,
    `taxConfigurationReference` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProductCommercialProfileVersion_productId_effectiveFrom_idx`(`productId`, `effectiveFrom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductPriceOption` (
    `id` VARCHAR(36) NOT NULL,
    `commercialProfileVersionId` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `setupFee` DECIMAL(65, 30) NULL,
    `currency` VARCHAR(3) NOT NULL,
    `billingCycle` VARCHAR(50) NULL,
    `quantityModel` VARCHAR(100) NULL,

    INDEX `ProductPriceOption_commercialProfileVersionId_idx`(`commercialProfileVersionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vendor` (
    `id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendorContact` (
    `id` VARCHAR(36) NOT NULL,
    `vendorId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,

    INDEX `VendorContact_vendorId_idx`(`vendorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierOffering` (
    `id` VARCHAR(36) NOT NULL,
    `vendorId` VARCHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `externalReference` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SupplierOffering_vendorId_idx`(`vendorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierAssignment` (
    `id` VARCHAR(36) NOT NULL,
    `productId` VARCHAR(36) NOT NULL,
    `supplierOfferingId` VARCHAR(36) NOT NULL,
    `effectiveFrom` DATETIME(3) NULL,
    `effectiveTo` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `SupplierAssignment_productId_effectiveFrom_idx`(`productId`, `effectiveFrom`),
    INDEX `SupplierAssignment_supplierOfferingId_idx`(`supplierOfferingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SupplierCostHistory` (
    `id` VARCHAR(36) NOT NULL,
    `supplierOfferingId` VARCHAR(36) NOT NULL,
    `cost` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `effectiveFrom` DATETIME(3) NOT NULL,
    `effectiveTo` DATETIME(3) NULL,

    INDEX `SupplierCostHistory_supplierOfferingId_effectiveFrom_idx`(`supplierOfferingId`, `effectiveFrom`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quote` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NOT NULL,
    `contactId` VARCHAR(36) NULL,
    `leadId` VARCHAR(36) NULL,
    `opportunityId` VARCHAR(36) NULL,
    `status` VARCHAR(50) NOT NULL,
    `issuedAt` DATETIME(3) NULL,
    `expiresAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Quote_customerAccountId_idx`(`customerAccountId`),
    INDEX `Quote_contactId_idx`(`contactId`),
    INDEX `Quote_leadId_idx`(`leadId`),
    INDEX `Quote_opportunityId_idx`(`opportunityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuoteItem` (
    `id` VARCHAR(36) NOT NULL,
    `quoteId` VARCHAR(36) NOT NULL,
    `productId` VARCHAR(36) NOT NULL,
    `productCode` VARCHAR(100) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `unitPrice` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `setupAmount` DECIMAL(65, 30) NULL,
    `recurringAmount` DECIMAL(65, 30) NULL,
    `billingCycle` VARCHAR(50) NULL,
    `discountAmount` DECIMAL(65, 30) NULL,
    `taxBasis` VARCHAR(100) NULL,
    `taxRate` DECIMAL(65, 30) NULL,
    `taxAmount` DECIMAL(65, 30) NULL,
    `lineTotal` DECIMAL(65, 30) NOT NULL,

    INDEX `QuoteItem_quoteId_idx`(`quoteId`),
    INDEX `QuoteItem_productId_idx`(`productId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NOT NULL,
    `quoteId` VARCHAR(36) NULL,
    `status` VARCHAR(50) NOT NULL,
    `placedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Order_customerAccountId_idx`(`customerAccountId`),
    INDEX `Order_quoteId_idx`(`quoteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` VARCHAR(36) NOT NULL,
    `orderId` VARCHAR(36) NOT NULL,
    `productId` VARCHAR(36) NOT NULL,
    `quoteItemId` VARCHAR(36) NULL,
    `productCode` VARCHAR(100) NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `unitPrice` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `setupAmount` DECIMAL(65, 30) NULL,
    `recurringAmount` DECIMAL(65, 30) NULL,
    `billingCycle` VARCHAR(50) NULL,
    `discountAmount` DECIMAL(65, 30) NULL,
    `taxBasis` VARCHAR(100) NULL,
    `taxRate` DECIMAL(65, 30) NULL,
    `taxAmount` DECIMAL(65, 30) NULL,
    `lineTotal` DECIMAL(65, 30) NOT NULL,

    INDEX `OrderItem_orderId_idx`(`orderId`),
    INDEX `OrderItem_productId_idx`(`productId`),
    INDEX `OrderItem_quoteItemId_idx`(`quoteItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NOT NULL,
    `productId` VARCHAR(36) NOT NULL,
    `orderItemId` VARCHAR(36) NULL,
    `supplierAssignmentId` VARCHAR(36) NULL,
    `productCodeSnapshot` VARCHAR(100) NOT NULL,
    `productNameSnapshot` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Service_customerAccountId_idx`(`customerAccountId`),
    INDEX `Service_productId_idx`(`productId`),
    INDEX `Service_orderItemId_idx`(`orderItemId`),
    INDEX `Service_supplierAssignmentId_idx`(`supplierAssignmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` VARCHAR(36) NOT NULL,
    `serviceId` VARCHAR(36) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `startedAt` DATETIME(3) NULL,
    `endedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Subscription_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubscriptionTermVersion` (
    `id` VARCHAR(36) NOT NULL,
    `subscriptionId` VARCHAR(36) NOT NULL,
    `productCommercialProfileVersionId` VARCHAR(36) NULL,
    `effectiveFrom` DATETIME(3) NOT NULL,
    `effectiveTo` DATETIME(3) NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `recurringPrice` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `billingCycle` VARCHAR(50) NOT NULL,

    INDEX `SubscriptionTermVersion_subscriptionId_effectiveFrom_idx`(`subscriptionId`, `effectiveFrom`),
    INDEX `SubscriptionTermVersion_productCommercialProfileVersionId_idx`(`productCommercialProfileVersionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProvisioningOperation` (
    `id` VARCHAR(36) NOT NULL,
    `serviceId` VARCHAR(36) NOT NULL,
    `supplierAssignmentId` VARCHAR(36) NULL,
    `operationKind` VARCHAR(100) NOT NULL,
    `outcome` VARCHAR(100) NULL,
    `externalReference` VARCHAR(191) NULL,
    `requestedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completedAt` DATETIME(3) NULL,

    INDEX `ProvisioningOperation_serviceId_requestedAt_idx`(`serviceId`, `requestedAt`),
    INDEX `ProvisioningOperation_supplierAssignmentId_idx`(`supplierAssignmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoice` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NOT NULL,
    `billingContactId` VARCHAR(36) NULL,
    `status` VARCHAR(50) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `issueDate` DATETIME(3) NULL,
    `dueDate` DATETIME(3) NULL,
    `subtotal` DECIMAL(65, 30) NULL,
    `taxTotal` DECIMAL(65, 30) NULL,
    `total` DECIMAL(65, 30) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Invoice_customerAccountId_idx`(`customerAccountId`),
    INDEX `Invoice_billingContactId_idx`(`billingContactId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InvoiceLine` (
    `id` VARCHAR(36) NOT NULL,
    `invoiceId` VARCHAR(36) NOT NULL,
    `productId` VARCHAR(36) NULL,
    `serviceId` VARCHAR(36) NULL,
    `subscriptionId` VARCHAR(36) NULL,
    `orderItemId` VARCHAR(36) NULL,
    `description` TEXT NOT NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `unitPrice` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `discountAmount` DECIMAL(65, 30) NULL,
    `taxBasis` VARCHAR(100) NULL,
    `taxRate` DECIMAL(65, 30) NULL,
    `taxAmount` DECIMAL(65, 30) NULL,
    `lineTotal` DECIMAL(65, 30) NOT NULL,

    INDEX `InvoiceLine_invoiceId_idx`(`invoiceId`),
    INDEX `InvoiceLine_productId_idx`(`productId`),
    INDEX `InvoiceLine_serviceId_idx`(`serviceId`),
    INDEX `InvoiceLine_subscriptionId_idx`(`subscriptionId`),
    INDEX `InvoiceLine_orderItemId_idx`(`orderItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `paymentMethod` VARCHAR(100) NULL,
    `paymentReference` VARCHAR(191) NULL,
    `receivedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Payment_customerAccountId_idx`(`customerAccountId`),
    INDEX `Payment_receivedAt_idx`(`receivedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentAllocation` (
    `id` VARCHAR(36) NOT NULL,
    `paymentId` VARCHAR(36) NOT NULL,
    `invoiceId` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `allocatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PaymentAllocation_paymentId_idx`(`paymentId`),
    INDEX `PaymentAllocation_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Credit` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `source` VARCHAR(191) NULL,
    `reason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Credit_customerAccountId_idx`(`customerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditApplication` (
    `id` VARCHAR(36) NOT NULL,
    `creditId` VARCHAR(36) NOT NULL,
    `invoiceId` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `appliedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CreditApplication_creditId_idx`(`creditId`),
    INDEX `CreditApplication_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreditNote` (
    `id` VARCHAR(36) NOT NULL,
    `invoiceId` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `reason` TEXT NULL,
    `issuedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CreditNote_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Refund` (
    `id` VARCHAR(36) NOT NULL,
    `paymentId` VARCHAR(36) NOT NULL,
    `invoiceId` VARCHAR(36) NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `reason` TEXT NULL,
    `refundedAt` DATETIME(3) NULL,

    INDEX `Refund_paymentId_idx`(`paymentId`),
    INDEX `Refund_invoiceId_idx`(`invoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseRequest` (
    `id` VARCHAR(36) NOT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrder` (
    `id` VARCHAR(36) NOT NULL,
    `vendorId` VARCHAR(36) NOT NULL,
    `purchaseRequestId` VARCHAR(36) NULL,
    `customerOrderId` VARCHAR(36) NULL,
    `serviceId` VARCHAR(36) NULL,
    `status` VARCHAR(50) NOT NULL,
    `issuedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PurchaseOrder_vendorId_idx`(`vendorId`),
    INDEX `PurchaseOrder_purchaseRequestId_idx`(`purchaseRequestId`),
    INDEX `PurchaseOrder_customerOrderId_idx`(`customerOrderId`),
    INDEX `PurchaseOrder_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrderItem` (
    `id` VARCHAR(36) NOT NULL,
    `purchaseOrderId` VARCHAR(36) NOT NULL,
    `supplierOfferingId` VARCHAR(36) NULL,
    `description` TEXT NOT NULL,
    `quantity` DECIMAL(65, 30) NOT NULL,
    `supplierCost` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `taxAmount` DECIMAL(65, 30) NULL,

    INDEX `PurchaseOrderItem_purchaseOrderId_idx`(`purchaseOrderId`),
    INDEX `PurchaseOrderItem_supplierOfferingId_idx`(`supplierOfferingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendorInvoice` (
    `id` VARCHAR(36) NOT NULL,
    `vendorId` VARCHAR(36) NOT NULL,
    `purchaseOrderId` VARCHAR(36) NULL,
    `amount` DECIMAL(65, 30) NULL,
    `currency` VARCHAR(3) NULL,
    `vendorInvoiceNumber` VARCHAR(191) NULL,
    `invoiceDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VendorInvoice_vendorId_idx`(`vendorId`),
    INDEX `VendorInvoice_purchaseOrderId_idx`(`purchaseOrderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VendorPayment` (
    `id` VARCHAR(36) NOT NULL,
    `vendorInvoiceId` VARCHAR(36) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `paymentReference` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `VendorPayment_vendorInvoiceId_idx`(`vendorInvoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ticket` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NOT NULL,
    `contactId` VARCHAR(36) NULL,
    `openedByUserId` VARCHAR(36) NULL,
    `assignedUserId` VARCHAR(36) NULL,
    `subject` VARCHAR(191) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `priority` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Ticket_customerAccountId_idx`(`customerAccountId`),
    INDEX `Ticket_contactId_idx`(`contactId`),
    INDEX `Ticket_openedByUserId_idx`(`openedByUserId`),
    INDEX `Ticket_assignedUserId_idx`(`assignedUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TicketMessage` (
    `id` VARCHAR(36) NOT NULL,
    `ticketId` VARCHAR(36) NOT NULL,
    `authorUserId` VARCHAR(36) NULL,
    `authorContactId` VARCHAR(36) NULL,
    `visibility` ENUM('PUBLIC', 'INTERNAL', 'SYSTEM') NOT NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `TicketMessage_ticketId_createdAt_idx`(`ticketId`, `createdAt`),
    INDEX `TicketMessage_authorUserId_idx`(`authorUserId`),
    INDEX `TicketMessage_authorContactId_idx`(`authorContactId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TicketContext` (
    `id` VARCHAR(36) NOT NULL,
    `ticketId` VARCHAR(36) NOT NULL,
    `serviceId` VARCHAR(36) NULL,
    `invoiceId` VARCHAR(36) NULL,
    `paymentId` VARCHAR(36) NULL,
    `creditId` VARCHAR(36) NULL,
    `refundId` VARCHAR(36) NULL,
    `subscriptionId` VARCHAR(36) NULL,
    `orderId` VARCHAR(36) NULL,
    `productId` VARCHAR(36) NULL,
    `relatedTicketId` VARCHAR(36) NULL,

    INDEX `TicketContext_ticketId_idx`(`ticketId`),
    INDEX `TicketContext_serviceId_idx`(`serviceId`),
    INDEX `TicketContext_invoiceId_idx`(`invoiceId`),
    INDEX `TicketContext_paymentId_idx`(`paymentId`),
    INDEX `TicketContext_creditId_idx`(`creditId`),
    INDEX `TicketContext_refundId_idx`(`refundId`),
    INDEX `TicketContext_subscriptionId_idx`(`subscriptionId`),
    INDEX `TicketContext_orderId_idx`(`orderId`),
    INDEX `TicketContext_productId_idx`(`productId`),
    INDEX `TicketContext_relatedTicketId_idx`(`relatedTicketId`),
    UNIQUE INDEX `TicketContext_ticketId_serviceId_key`(`ticketId`, `serviceId`),
    UNIQUE INDEX `TicketContext_ticketId_invoiceId_key`(`ticketId`, `invoiceId`),
    UNIQUE INDEX `TicketContext_ticketId_paymentId_key`(`ticketId`, `paymentId`),
    UNIQUE INDEX `TicketContext_ticketId_creditId_key`(`ticketId`, `creditId`),
    UNIQUE INDEX `TicketContext_ticketId_refundId_key`(`ticketId`, `refundId`),
    UNIQUE INDEX `TicketContext_ticketId_subscriptionId_key`(`ticketId`, `subscriptionId`),
    UNIQUE INDEX `TicketContext_ticketId_orderId_key`(`ticketId`, `orderId`),
    UNIQUE INDEX `TicketContext_ticketId_productId_key`(`ticketId`, `productId`),
    UNIQUE INDEX `TicketContext_ticketId_relatedTicketId_key`(`ticketId`, `relatedTicketId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NULL,
    `uploadedByUserId` VARCHAR(36) NULL,
    `name` VARCHAR(191) NOT NULL,
    `visibility` ENUM('CUSTOMER', 'INTERNAL', 'RESTRICTED') NOT NULL,
    `category` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Document_customerAccountId_idx`(`customerAccountId`),
    INDEX `Document_uploadedByUserId_idx`(`uploadedByUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentVersion` (
    `id` VARCHAR(36) NOT NULL,
    `documentId` VARCHAR(36) NOT NULL,
    `uploadedByUserId` VARCHAR(36) NULL,
    `versionNumber` INTEGER NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NULL,
    `fileSize` BIGINT NULL,
    `storageReference` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DocumentVersion_uploadedByUserId_idx`(`uploadedByUserId`),
    UNIQUE INDEX `DocumentVersion_documentId_versionNumber_key`(`documentId`, `versionNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentRelation` (
    `id` VARCHAR(36) NOT NULL,
    `documentId` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NULL,
    `contactId` VARCHAR(36) NULL,
    `userId` VARCHAR(36) NULL,
    `leadId` VARCHAR(36) NULL,
    `opportunityId` VARCHAR(36) NULL,
    `quoteId` VARCHAR(36) NULL,
    `orderId` VARCHAR(36) NULL,
    `serviceId` VARCHAR(36) NULL,
    `subscriptionId` VARCHAR(36) NULL,
    `invoiceId` VARCHAR(36) NULL,
    `paymentId` VARCHAR(36) NULL,
    `creditNoteId` VARCHAR(36) NULL,
    `ticketId` VARCHAR(36) NULL,
    `vendorId` VARCHAR(36) NULL,
    `purchaseOrderId` VARCHAR(36) NULL,
    `vendorInvoiceId` VARCHAR(36) NULL,

    INDEX `DocumentRelation_documentId_idx`(`documentId`),
    INDEX `DocumentRelation_customerAccountId_idx`(`customerAccountId`),
    INDEX `DocumentRelation_contactId_idx`(`contactId`),
    INDEX `DocumentRelation_userId_idx`(`userId`),
    INDEX `DocumentRelation_leadId_idx`(`leadId`),
    INDEX `DocumentRelation_opportunityId_idx`(`opportunityId`),
    INDEX `DocumentRelation_quoteId_idx`(`quoteId`),
    INDEX `DocumentRelation_orderId_idx`(`orderId`),
    INDEX `DocumentRelation_serviceId_idx`(`serviceId`),
    INDEX `DocumentRelation_subscriptionId_idx`(`subscriptionId`),
    INDEX `DocumentRelation_invoiceId_idx`(`invoiceId`),
    INDEX `DocumentRelation_paymentId_idx`(`paymentId`),
    INDEX `DocumentRelation_creditNoteId_idx`(`creditNoteId`),
    INDEX `DocumentRelation_ticketId_idx`(`ticketId`),
    INDEX `DocumentRelation_vendorId_idx`(`vendorId`),
    INDEX `DocumentRelation_purchaseOrderId_idx`(`purchaseOrderId`),
    INDEX `DocumentRelation_vendorInvoiceId_idx`(`vendorInvoiceId`),
    UNIQUE INDEX `DocumentRelation_documentId_customerAccountId_key`(`documentId`, `customerAccountId`),
    UNIQUE INDEX `DocumentRelation_documentId_contactId_key`(`documentId`, `contactId`),
    UNIQUE INDEX `DocumentRelation_documentId_userId_key`(`documentId`, `userId`),
    UNIQUE INDEX `DocumentRelation_documentId_leadId_key`(`documentId`, `leadId`),
    UNIQUE INDEX `DocumentRelation_documentId_opportunityId_key`(`documentId`, `opportunityId`),
    UNIQUE INDEX `DocumentRelation_documentId_quoteId_key`(`documentId`, `quoteId`),
    UNIQUE INDEX `DocumentRelation_documentId_orderId_key`(`documentId`, `orderId`),
    UNIQUE INDEX `DocumentRelation_documentId_serviceId_key`(`documentId`, `serviceId`),
    UNIQUE INDEX `DocumentRelation_documentId_subscriptionId_key`(`documentId`, `subscriptionId`),
    UNIQUE INDEX `DocumentRelation_documentId_invoiceId_key`(`documentId`, `invoiceId`),
    UNIQUE INDEX `DocumentRelation_documentId_paymentId_key`(`documentId`, `paymentId`),
    UNIQUE INDEX `DocumentRelation_documentId_creditNoteId_key`(`documentId`, `creditNoteId`),
    UNIQUE INDEX `DocumentRelation_documentId_ticketId_key`(`documentId`, `ticketId`),
    UNIQUE INDEX `DocumentRelation_documentId_vendorId_key`(`documentId`, `vendorId`),
    UNIQUE INDEX `DocumentRelation_documentId_purchaseOrderId_key`(`documentId`, `purchaseOrderId`),
    UNIQUE INDEX `DocumentRelation_documentId_vendorInvoiceId_key`(`documentId`, `vendorInvoiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NULL,
    `eventType` VARCHAR(100) NOT NULL,
    `title` VARCHAR(191) NULL,
    `body` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Notification_customerAccountId_createdAt_idx`(`customerAccountId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationDelivery` (
    `id` VARCHAR(36) NOT NULL,
    `notificationId` VARCHAR(36) NOT NULL,
    `recipientUserId` VARCHAR(36) NOT NULL,
    `customerMembershipId` VARCHAR(36) NULL,
    `customerAccountId` VARCHAR(36) NULL,
    `channel` VARCHAR(50) NOT NULL,
    `templateId` VARCHAR(36) NULL,
    `status` VARCHAR(50) NOT NULL,
    `sentAt` DATETIME(3) NULL,
    `failureInformation` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `NotificationDelivery_notificationId_idx`(`notificationId`),
    INDEX `NotificationDelivery_recipientUserId_idx`(`recipientUserId`),
    INDEX `NotificationDelivery_customerMembershipId_recipientUserId_cu_idx`(`customerMembershipId`, `recipientUserId`, `customerAccountId`),
    INDEX `NotificationDelivery_templateId_idx`(`templateId`),
    INDEX `NotificationDelivery_status_idx`(`status`),
    UNIQUE INDEX `NotificationDelivery_notificationId_recipientUserId_channel_key`(`notificationId`, `recipientUserId`, `channel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationContext` (
    `id` VARCHAR(36) NOT NULL,
    `notificationId` VARCHAR(36) NOT NULL,
    `customerAccountId` VARCHAR(36) NULL,
    `userId` VARCHAR(36) NULL,
    `leadId` VARCHAR(36) NULL,
    `opportunityId` VARCHAR(36) NULL,
    `activityId` VARCHAR(36) NULL,
    `quoteId` VARCHAR(36) NULL,
    `orderId` VARCHAR(36) NULL,
    `serviceId` VARCHAR(36) NULL,
    `subscriptionId` VARCHAR(36) NULL,
    `invoiceId` VARCHAR(36) NULL,
    `paymentId` VARCHAR(36) NULL,
    `creditId` VARCHAR(36) NULL,
    `creditNoteId` VARCHAR(36) NULL,
    `refundId` VARCHAR(36) NULL,
    `ticketId` VARCHAR(36) NULL,
    `provisioningOperationId` VARCHAR(36) NULL,
    `vendorId` VARCHAR(36) NULL,
    `purchaseOrderId` VARCHAR(36) NULL,
    `vendorInvoiceId` VARCHAR(36) NULL,
    `documentId` VARCHAR(36) NULL,

    INDEX `NotificationContext_notificationId_idx`(`notificationId`),
    INDEX `NotificationContext_customerAccountId_idx`(`customerAccountId`),
    INDEX `NotificationContext_userId_idx`(`userId`),
    INDEX `NotificationContext_leadId_idx`(`leadId`),
    INDEX `NotificationContext_opportunityId_idx`(`opportunityId`),
    INDEX `NotificationContext_activityId_idx`(`activityId`),
    INDEX `NotificationContext_quoteId_idx`(`quoteId`),
    INDEX `NotificationContext_orderId_idx`(`orderId`),
    INDEX `NotificationContext_serviceId_idx`(`serviceId`),
    INDEX `NotificationContext_subscriptionId_idx`(`subscriptionId`),
    INDEX `NotificationContext_invoiceId_idx`(`invoiceId`),
    INDEX `NotificationContext_paymentId_idx`(`paymentId`),
    INDEX `NotificationContext_creditId_idx`(`creditId`),
    INDEX `NotificationContext_creditNoteId_idx`(`creditNoteId`),
    INDEX `NotificationContext_refundId_idx`(`refundId`),
    INDEX `NotificationContext_ticketId_idx`(`ticketId`),
    INDEX `NotificationContext_provisioningOperationId_idx`(`provisioningOperationId`),
    INDEX `NotificationContext_vendorId_idx`(`vendorId`),
    INDEX `NotificationContext_purchaseOrderId_idx`(`purchaseOrderId`),
    INDEX `NotificationContext_vendorInvoiceId_idx`(`vendorInvoiceId`),
    INDEX `NotificationContext_documentId_idx`(`documentId`),
    UNIQUE INDEX `NotificationContext_notificationId_customerAccountId_key`(`notificationId`, `customerAccountId`),
    UNIQUE INDEX `NotificationContext_notificationId_userId_key`(`notificationId`, `userId`),
    UNIQUE INDEX `NotificationContext_notificationId_leadId_key`(`notificationId`, `leadId`),
    UNIQUE INDEX `NotificationContext_notificationId_opportunityId_key`(`notificationId`, `opportunityId`),
    UNIQUE INDEX `NotificationContext_notificationId_activityId_key`(`notificationId`, `activityId`),
    UNIQUE INDEX `NotificationContext_notificationId_quoteId_key`(`notificationId`, `quoteId`),
    UNIQUE INDEX `NotificationContext_notificationId_orderId_key`(`notificationId`, `orderId`),
    UNIQUE INDEX `NotificationContext_notificationId_serviceId_key`(`notificationId`, `serviceId`),
    UNIQUE INDEX `NotificationContext_notificationId_subscriptionId_key`(`notificationId`, `subscriptionId`),
    UNIQUE INDEX `NotificationContext_notificationId_invoiceId_key`(`notificationId`, `invoiceId`),
    UNIQUE INDEX `NotificationContext_notificationId_paymentId_key`(`notificationId`, `paymentId`),
    UNIQUE INDEX `NotificationContext_notificationId_creditId_key`(`notificationId`, `creditId`),
    UNIQUE INDEX `NotificationContext_notificationId_creditNoteId_key`(`notificationId`, `creditNoteId`),
    UNIQUE INDEX `NotificationContext_notificationId_refundId_key`(`notificationId`, `refundId`),
    UNIQUE INDEX `NotificationContext_notificationId_ticketId_key`(`notificationId`, `ticketId`),
    UNIQUE INDEX `NotificationContext_notificationId_provisioningOperationId_key`(`notificationId`, `provisioningOperationId`),
    UNIQUE INDEX `NotificationContext_notificationId_vendorId_key`(`notificationId`, `vendorId`),
    UNIQUE INDEX `NotificationContext_notificationId_purchaseOrderId_key`(`notificationId`, `purchaseOrderId`),
    UNIQUE INDEX `NotificationContext_notificationId_vendorInvoiceId_key`(`notificationId`, `vendorInvoiceId`),
    UNIQUE INDEX `NotificationContext_notificationId_documentId_key`(`notificationId`, `documentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationPreference` (
    `id` VARCHAR(36) NOT NULL,
    `userId` VARCHAR(36) NOT NULL,
    `customerMembershipId` VARCHAR(36) NULL,
    `category` VARCHAR(100) NOT NULL,
    `channel` VARCHAR(50) NOT NULL,
    `enabled` BOOLEAN NOT NULL,

    INDEX `NotificationPreference_userId_idx`(`userId`),
    INDEX `NotificationPreference_customerMembershipId_idx`(`customerMembershipId`),
    INDEX `NotificationPreference_customerMembershipId_userId_idx`(`customerMembershipId`, `userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationTemplate` (
    `id` VARCHAR(36) NOT NULL,
    `eventType` VARCHAR(100) NOT NULL,
    `channel` VARCHAR(50) NOT NULL,
    `subject` VARCHAR(191) NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `NotificationTemplate_eventType_channel_idx`(`eventType`, `channel`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditEvent` (
    `id` VARCHAR(36) NOT NULL,
    `actorType` ENUM('USER', 'SYSTEM') NOT NULL,
    `actorUserId` VARCHAR(36) NULL,
    `targetKind` VARCHAR(100) NOT NULL,
    `targetId` VARCHAR(36) NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditEvent_targetKind_targetId_idx`(`targetKind`, `targetId`),
    INDEX `AuditEvent_actorUserId_createdAt_idx`(`actorUserId`, `createdAt`),
    INDEX `AuditEvent_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerMembership` ADD CONSTRAINT `CustomerMembership_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerMembership` ADD CONSTRAINT `CustomerMembership_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerMembership` ADD CONSTRAINT `CustomerMembership_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalRoleAssignment` ADD CONSTRAINT `InternalRoleAssignment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InternalRoleAssignment` ADD CONSTRAINT `InternalRoleAssignment_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_ownerUserId_fkey` FOREIGN KEY (`ownerUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Opportunity` ADD CONSTRAINT `Opportunity_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Opportunity` ADD CONSTRAINT `Opportunity_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Opportunity` ADD CONSTRAINT `Opportunity_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Opportunity` ADD CONSTRAINT `Opportunity_ownerUserId_fkey` FOREIGN KEY (`ownerUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_assignedUserId_fkey` FOREIGN KEY (`assignedUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityContext` ADD CONSTRAINT `ActivityContext_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityContext` ADD CONSTRAINT `ActivityContext_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityContext` ADD CONSTRAINT `ActivityContext_opportunityId_fkey` FOREIGN KEY (`opportunityId`) REFERENCES `Opportunity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityContext` ADD CONSTRAINT `ActivityContext_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityContext` ADD CONSTRAINT `ActivityContext_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityContext` ADD CONSTRAINT `ActivityContext_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityContext` ADD CONSTRAINT `ActivityContext_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityContext` ADD CONSTRAINT `ActivityContext_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCommercialProfileVersion` ADD CONSTRAINT `ProductCommercialProfileVersion_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPriceOption` ADD CONSTRAINT `ProductPriceOption_commercialProfileVersionId_fkey` FOREIGN KEY (`commercialProfileVersionId`) REFERENCES `ProductCommercialProfileVersion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorContact` ADD CONSTRAINT `VendorContact_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierOffering` ADD CONSTRAINT `SupplierOffering_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierAssignment` ADD CONSTRAINT `SupplierAssignment_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierAssignment` ADD CONSTRAINT `SupplierAssignment_supplierOfferingId_fkey` FOREIGN KEY (`supplierOfferingId`) REFERENCES `SupplierOffering`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SupplierCostHistory` ADD CONSTRAINT `SupplierCostHistory_supplierOfferingId_fkey` FOREIGN KEY (`supplierOfferingId`) REFERENCES `SupplierOffering`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quote` ADD CONSTRAINT `Quote_opportunityId_fkey` FOREIGN KEY (`opportunityId`) REFERENCES `Opportunity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuoteItem` ADD CONSTRAINT `QuoteItem_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuoteItem` ADD CONSTRAINT `QuoteItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_quoteItemId_fkey` FOREIGN KEY (`quoteItemId`) REFERENCES `QuoteItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Service` ADD CONSTRAINT `Service_supplierAssignmentId_fkey` FOREIGN KEY (`supplierAssignmentId`) REFERENCES `SupplierAssignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscription` ADD CONSTRAINT `Subscription_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionTermVersion` ADD CONSTRAINT `SubscriptionTermVersion_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionTermVersion` ADD CONSTRAINT `SubscriptionTermVersion_productCommercialProfileVersionId_fkey` FOREIGN KEY (`productCommercialProfileVersionId`) REFERENCES `ProductCommercialProfileVersion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProvisioningOperation` ADD CONSTRAINT `ProvisioningOperation_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProvisioningOperation` ADD CONSTRAINT `ProvisioningOperation_supplierAssignmentId_fkey` FOREIGN KEY (`supplierAssignmentId`) REFERENCES `SupplierAssignment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_billingContactId_fkey` FOREIGN KEY (`billingContactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceLine` ADD CONSTRAINT `InvoiceLine_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceLine` ADD CONSTRAINT `InvoiceLine_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceLine` ADD CONSTRAINT `InvoiceLine_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceLine` ADD CONSTRAINT `InvoiceLine_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InvoiceLine` ADD CONSTRAINT `InvoiceLine_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentAllocation` ADD CONSTRAINT `PaymentAllocation_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PaymentAllocation` ADD CONSTRAINT `PaymentAllocation_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Credit` ADD CONSTRAINT `Credit_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditApplication` ADD CONSTRAINT `CreditApplication_creditId_fkey` FOREIGN KEY (`creditId`) REFERENCES `Credit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditApplication` ADD CONSTRAINT `CreditApplication_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreditNote` ADD CONSTRAINT `CreditNote_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_purchaseRequestId_fkey` FOREIGN KEY (`purchaseRequestId`) REFERENCES `PurchaseRequest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_customerOrderId_fkey` FOREIGN KEY (`customerOrderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_supplierOfferingId_fkey` FOREIGN KEY (`supplierOfferingId`) REFERENCES `SupplierOffering`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorInvoice` ADD CONSTRAINT `VendorInvoice_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorInvoice` ADD CONSTRAINT `VendorInvoice_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VendorPayment` ADD CONSTRAINT `VendorPayment_vendorInvoiceId_fkey` FOREIGN KEY (`vendorInvoiceId`) REFERENCES `VendorInvoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_openedByUserId_fkey` FOREIGN KEY (`openedByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_assignedUserId_fkey` FOREIGN KEY (`assignedUserId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketMessage` ADD CONSTRAINT `TicketMessage_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketMessage` ADD CONSTRAINT `TicketMessage_authorUserId_fkey` FOREIGN KEY (`authorUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketMessage` ADD CONSTRAINT `TicketMessage_authorContactId_fkey` FOREIGN KEY (`authorContactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_creditId_fkey` FOREIGN KEY (`creditId`) REFERENCES `Credit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_refundId_fkey` FOREIGN KEY (`refundId`) REFERENCES `Refund`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TicketContext` ADD CONSTRAINT `TicketContext_relatedTicketId_fkey` FOREIGN KEY (`relatedTicketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_uploadedByUserId_fkey` FOREIGN KEY (`uploadedByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentVersion` ADD CONSTRAINT `DocumentVersion_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentVersion` ADD CONSTRAINT `DocumentVersion_uploadedByUserId_fkey` FOREIGN KEY (`uploadedByUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_opportunityId_fkey` FOREIGN KEY (`opportunityId`) REFERENCES `Opportunity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_creditNoteId_fkey` FOREIGN KEY (`creditNoteId`) REFERENCES `CreditNote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DocumentRelation` ADD CONSTRAINT `DocumentRelation_vendorInvoiceId_fkey` FOREIGN KEY (`vendorInvoiceId`) REFERENCES `VendorInvoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationDelivery` ADD CONSTRAINT `NotificationDelivery_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationDelivery` ADD CONSTRAINT `NotificationDelivery_recipientUserId_fkey` FOREIGN KEY (`recipientUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationDelivery` ADD CONSTRAINT `NotificationDelivery_customerMembershipId_recipientUserId_c_fkey` FOREIGN KEY (`customerMembershipId`, `recipientUserId`, `customerAccountId`) REFERENCES `CustomerMembership`(`id`, `userId`, `customerAccountId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationDelivery` ADD CONSTRAINT `NotificationDelivery_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `NotificationTemplate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_notificationId_fkey` FOREIGN KEY (`notificationId`) REFERENCES `Notification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_customerAccountId_fkey` FOREIGN KEY (`customerAccountId`) REFERENCES `CustomerAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_opportunityId_fkey` FOREIGN KEY (`opportunityId`) REFERENCES `Opportunity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_quoteId_fkey` FOREIGN KEY (`quoteId`) REFERENCES `Quote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_creditId_fkey` FOREIGN KEY (`creditId`) REFERENCES `Credit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_creditNoteId_fkey` FOREIGN KEY (`creditNoteId`) REFERENCES `CreditNote`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_refundId_fkey` FOREIGN KEY (`refundId`) REFERENCES `Refund`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `Ticket`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_provisioningOperationId_fkey` FOREIGN KEY (`provisioningOperationId`) REFERENCES `ProvisioningOperation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_purchaseOrderId_fkey` FOREIGN KEY (`purchaseOrderId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_vendorInvoiceId_fkey` FOREIGN KEY (`vendorInvoiceId`) REFERENCES `VendorInvoice`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationContext` ADD CONSTRAINT `NotificationContext_documentId_fkey` FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationPreference` ADD CONSTRAINT `NotificationPreference_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NotificationPreference` ADD CONSTRAINT `NotificationPreference_customerMembershipId_userId_fkey` FOREIGN KEY (`customerMembershipId`, `userId`) REFERENCES `CustomerMembership`(`id`, `userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditEvent` ADD CONSTRAINT `AuditEvent_actorUserId_fkey` FOREIGN KEY (`actorUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enforce the approved exactly-one-target and exactly-one-author rules.
ALTER TABLE `ActivityContext`
    ADD CONSTRAINT `ActivityContext_exactly_one_target_chk`
    CHECK (
        (`leadId` IS NOT NULL) + (`opportunityId` IS NOT NULL) +
        (`customerAccountId` IS NOT NULL) + (`contactId` IS NOT NULL) +
        (`quoteId` IS NOT NULL) + (`orderId` IS NOT NULL) +
        (`ticketId` IS NOT NULL) = 1
    );

ALTER TABLE `TicketContext`
    ADD CONSTRAINT `TicketContext_exactly_one_target_chk`
    CHECK (
        (`serviceId` IS NOT NULL) + (`invoiceId` IS NOT NULL) +
        (`paymentId` IS NOT NULL) + (`creditId` IS NOT NULL) +
        (`refundId` IS NOT NULL) + (`subscriptionId` IS NOT NULL) +
        (`orderId` IS NOT NULL) + (`productId` IS NOT NULL) +
        (`relatedTicketId` IS NOT NULL) = 1
    );

ALTER TABLE `DocumentRelation`
    ADD CONSTRAINT `DocumentRelation_exactly_one_target_chk`
    CHECK (
        (`customerAccountId` IS NOT NULL) + (`contactId` IS NOT NULL) +
        (`userId` IS NOT NULL) + (`leadId` IS NOT NULL) +
        (`opportunityId` IS NOT NULL) + (`quoteId` IS NOT NULL) +
        (`orderId` IS NOT NULL) + (`serviceId` IS NOT NULL) +
        (`subscriptionId` IS NOT NULL) + (`invoiceId` IS NOT NULL) +
        (`paymentId` IS NOT NULL) + (`creditNoteId` IS NOT NULL) +
        (`ticketId` IS NOT NULL) + (`vendorId` IS NOT NULL) +
        (`purchaseOrderId` IS NOT NULL) + (`vendorInvoiceId` IS NOT NULL) = 1
    );

ALTER TABLE `NotificationContext`
    ADD CONSTRAINT `NotificationContext_exactly_one_target_chk`
    CHECK (
        (`customerAccountId` IS NOT NULL) + (`userId` IS NOT NULL) +
        (`leadId` IS NOT NULL) + (`opportunityId` IS NOT NULL) +
        (`activityId` IS NOT NULL) + (`quoteId` IS NOT NULL) +
        (`orderId` IS NOT NULL) + (`serviceId` IS NOT NULL) +
        (`subscriptionId` IS NOT NULL) + (`invoiceId` IS NOT NULL) +
        (`paymentId` IS NOT NULL) + (`creditId` IS NOT NULL) +
        (`creditNoteId` IS NOT NULL) + (`refundId` IS NOT NULL) +
        (`ticketId` IS NOT NULL) + (`provisioningOperationId` IS NOT NULL) +
        (`vendorId` IS NOT NULL) + (`purchaseOrderId` IS NOT NULL) +
        (`vendorInvoiceId` IS NOT NULL) + (`documentId` IS NOT NULL) = 1
    );

ALTER TABLE `TicketMessage`
    ADD CONSTRAINT `TicketMessage_exactly_one_author_chk`
    CHECK ((`authorUserId` IS NOT NULL) + (`authorContactId` IS NOT NULL) = 1);

ALTER TABLE `AuditEvent`
    ADD CONSTRAINT `AuditEvent_actor_context_chk`
    CHECK (
        (`actorType` = 'USER' AND `actorUserId` IS NOT NULL) OR
        (`actorType` = 'SYSTEM' AND `actorUserId` IS NULL)
    );
