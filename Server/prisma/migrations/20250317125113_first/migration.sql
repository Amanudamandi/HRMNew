-- CreateTable
CREATE TABLE `employee` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `employeeCode` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `biometricPunchId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `refreshToken` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NULL,
    `joiningFormId` VARCHAR(191) NULL,
    `employeePersonalDetailId` VARCHAR(191) NULL,
    `employeeBankDetailId` VARCHAR(191) NULL,
    `employeeAttachmentDetailId` VARCHAR(191) NULL,
    `employeeWorkDetailId` VARCHAR(191) NULL,
    `employeeSalaryDetailId` VARCHAR(191) NULL,

    UNIQUE INDEX `employee_employeeCode_key`(`employeeCode`),
    UNIQUE INDEX `employee_joiningFormId_key`(`joiningFormId`),
    UNIQUE INDEX `employee_employeePersonalDetailId_key`(`employeePersonalDetailId`),
    UNIQUE INDEX `employee_employeeBankDetailId_key`(`employeeBankDetailId`),
    UNIQUE INDEX `employee_employeeAttachmentDetailId_key`(`employeeAttachmentDetailId`),
    UNIQUE INDEX `employee_employeeWorkDetailId_key`(`employeeWorkDetailId`),
    UNIQUE INDEX `employee_employeeSalaryDetailId_key`(`employeeSalaryDetailId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `joining_form` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    `formData` JSON NOT NULL,
    `interviewDate` DATETIME(3) NULL,
    `joiningDate` DATETIME(3) NULL,
    `modeOfRecruitment` VARCHAR(191) NULL,
    `reference` VARCHAR(191) NULL,
    `uanNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedById` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `work_type` (
    `id` VARCHAR(191) NOT NULL,
    `workType` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `work_type_workType_key`(`workType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qualification` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `degree` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `qualificationId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `department` (
    `id` VARCHAR(191) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `department_department_key`(`department`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `designation` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `departmentId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `company` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `company_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branch` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `pin` INTEGER NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shift` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `markAsAbsent` ENUM('AAA', 'L_WO_L') NOT NULL DEFAULT 'L_WO_L',
    `isNightShift` BOOLEAN NOT NULL DEFAULT false,
    `weekOff` ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL DEFAULT 'Sunday',
    `maxEarlyAllowed` VARCHAR(191) NOT NULL,
    `maxLateAllowed` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `shift_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `office_time_policy` (
    `id` VARCHAR(191) NOT NULL,
    `policyName` VARCHAR(191) NOT NULL,
    `permittedLateArrival` VARCHAR(191) NOT NULL,
    `absent` VARCHAR(191) NOT NULL,
    `pByTwo` VARCHAR(191) NOT NULL,
    `multiPunch` BOOLEAN NOT NULL DEFAULT true,
    `lateArrival1` VARCHAR(191) NULL,
    `lateArrival2` VARCHAR(191) NULL,
    `lateArrival3` VARCHAR(191) NULL,
    `lateArrival4` VARCHAR(191) NULL,
    `dayDeduct1` INTEGER NULL,
    `dayDeduct2` INTEGER NULL,
    `dayDeduct3` INTEGER NULL,
    `dayDeduct4` INTEGER NULL,
    `lateComingRule` BOOLEAN NOT NULL DEFAULT true,
    `deductFromAttendance` BOOLEAN NULL,
    `deductFromLeave` BOOLEAN NULL,
    `allowedLateDaysInMonth` INTEGER NULL,
    `salaryCutPercentage` INTEGER NULL,
    `continuous` BOOLEAN NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `office_time_policy_policyName_key`(`policyName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emp_personal_detail` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `father_husbandName` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NOT NULL,
    `personalPhoneNum` VARCHAR(10) NOT NULL,
    `personalEmail` VARCHAR(191) NOT NULL,
    `panCard` VARCHAR(10) NOT NULL,
    `aadharCard` VARCHAR(12) NOT NULL,
    `permanentAddress` JSON NULL,
    `currentAddress` JSON NULL,
    `gender` VARCHAR(191) NOT NULL,
    `maritalStatus` VARCHAR(191) NOT NULL,
    `bloodGroup` VARCHAR(191) NOT NULL,
    `emergencyContact` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `employeeId` VARCHAR(191) NULL,
    `joiningFormId` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,

    UNIQUE INDEX `emp_personal_detail_employeeId_key`(`employeeId`),
    UNIQUE INDEX `emp_personal_detail_joiningFormId_key`(`joiningFormId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emp_bank_detail` (
    `id` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `branchName` VARCHAR(191) NOT NULL,
    `bankAccount` VARCHAR(191) NOT NULL,
    `bankIFSC` VARCHAR(191) NOT NULL,
    `bankAccountHolderName` VARCHAR(191) NOT NULL,
    `bankAddress` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NULL,
    `joiningFormId` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `emp_bank_detail_employeeId_key`(`employeeId`),
    UNIQUE INDEX `emp_bank_detail_joiningFormId_key`(`joiningFormId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emp_attachment` (
    `id` VARCHAR(191) NOT NULL,
    `aadharCardAttachment` VARCHAR(191) NULL,
    `panCardAttachment` VARCHAR(191) NULL,
    `bankAttachment` VARCHAR(191) NULL,
    `class10Attachment` VARCHAR(191) NULL,
    `class12Attachment` VARCHAR(191) NULL,
    `graduationAttachment` VARCHAR(191) NULL,
    `postGraduationAttachment` VARCHAR(191) NULL,
    `photoAttachment` VARCHAR(191) NOT NULL,
    `signatureAttachment` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NULL,
    `joiningFormId` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `emp_attachment_employeeId_key`(`employeeId`),
    UNIQUE INDEX `emp_attachment_joiningFormId_key`(`joiningFormId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporting_manager` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emp_work_detail` (
    `id` VARCHAR(191) NOT NULL,
    `companyPhoneNum` VARCHAR(10) NULL,
    `companyEmail` VARCHAR(191) NULL,
    `joiningDate` DATETIME(3) NULL,
    `lastAppraisalDate` DATETIME(3) NULL,
    `regisnationDate` DATETIME(3) NULL,
    `reportingManagerId` VARCHAR(191) NULL,
    `joiningHrId` VARCHAR(191) NULL,
    `officeTimePolicyId` VARCHAR(191) NULL,
    `shiftId` VARCHAR(191) NULL,
    `companyId` VARCHAR(191) NULL,
    `branchId` VARCHAR(191) NULL,
    `departmentId` VARCHAR(191) NULL,
    `designationId` VARCHAR(191) NULL,
    `qualificationId` VARCHAR(191) NULL,
    `degreeId` VARCHAR(191) NULL,
    `workTypeId` VARCHAR(191) NULL,
    `updatedById` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NULL,
    `joiningId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `emp_work_detail_employeeId_key`(`employeeId`),
    UNIQUE INDEX `emp_work_detail_joiningId_key`(`joiningId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emp_salary_detail` (
    `id` VARCHAR(191) NOT NULL,
    `ctc` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `inHand` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `employeeESI` DECIMAL(65, 30) NULL DEFAULT 0,
    `employeePF` DECIMAL(65, 30) NULL DEFAULT 0,
    `employerESI` DECIMAL(65, 30) NULL DEFAULT 0,
    `employerPF` DECIMAL(65, 30) NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedById` VARCHAR(191) NOT NULL,
    `employeeId` VARCHAR(191) NULL,
    `joiningFormId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `emp_salary_detail_employeeId_key`(`employeeId`),
    UNIQUE INDEX `emp_salary_detail_joiningFormId_key`(`joiningFormId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee` ADD CONSTRAINT `employee_joiningFormId_fkey` FOREIGN KEY (`joiningFormId`) REFERENCES `joining_form`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `joining_form` ADD CONSTRAINT `joining_form_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work_type` ADD CONSTRAINT `work_type_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `work_type` ADD CONSTRAINT `work_type_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `qualification` ADD CONSTRAINT `qualification_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `qualification` ADD CONSTRAINT `qualification_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `degree` ADD CONSTRAINT `degree_qualificationId_fkey` FOREIGN KEY (`qualificationId`) REFERENCES `qualification`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `degree` ADD CONSTRAINT `degree_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `degree` ADD CONSTRAINT `degree_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department` ADD CONSTRAINT `department_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department` ADD CONSTRAINT `department_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `designation` ADD CONSTRAINT `designation_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `designation` ADD CONSTRAINT `designation_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `designation` ADD CONSTRAINT `designation_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch` ADD CONSTRAINT `branch_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch` ADD CONSTRAINT `branch_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `branch` ADD CONSTRAINT `branch_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shift` ADD CONSTRAINT `shift_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shift` ADD CONSTRAINT `shift_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `office_time_policy` ADD CONSTRAINT `office_time_policy_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `office_time_policy` ADD CONSTRAINT `office_time_policy_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_personal_detail` ADD CONSTRAINT `emp_personal_detail_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_personal_detail` ADD CONSTRAINT `emp_personal_detail_joiningFormId_fkey` FOREIGN KEY (`joiningFormId`) REFERENCES `joining_form`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_personal_detail` ADD CONSTRAINT `emp_personal_detail_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_bank_detail` ADD CONSTRAINT `emp_bank_detail_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_bank_detail` ADD CONSTRAINT `emp_bank_detail_joiningFormId_fkey` FOREIGN KEY (`joiningFormId`) REFERENCES `joining_form`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_bank_detail` ADD CONSTRAINT `emp_bank_detail_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_attachment` ADD CONSTRAINT `emp_attachment_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_attachment` ADD CONSTRAINT `emp_attachment_joiningFormId_fkey` FOREIGN KEY (`joiningFormId`) REFERENCES `joining_form`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_attachment` ADD CONSTRAINT `emp_attachment_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reporting_manager` ADD CONSTRAINT `reporting_manager_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reporting_manager` ADD CONSTRAINT `reporting_manager_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_reportingManagerId_fkey` FOREIGN KEY (`reportingManagerId`) REFERENCES `reporting_manager`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_joiningHrId_fkey` FOREIGN KEY (`joiningHrId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_officeTimePolicyId_fkey` FOREIGN KEY (`officeTimePolicyId`) REFERENCES `office_time_policy`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_shiftId_fkey` FOREIGN KEY (`shiftId`) REFERENCES `shift`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `branch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_designationId_fkey` FOREIGN KEY (`designationId`) REFERENCES `designation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_qualificationId_fkey` FOREIGN KEY (`qualificationId`) REFERENCES `qualification`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_degreeId_fkey` FOREIGN KEY (`degreeId`) REFERENCES `degree`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_workTypeId_fkey` FOREIGN KEY (`workTypeId`) REFERENCES `work_type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_work_detail` ADD CONSTRAINT `emp_work_detail_joiningId_fkey` FOREIGN KEY (`joiningId`) REFERENCES `joining_form`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_salary_detail` ADD CONSTRAINT `emp_salary_detail_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `employee`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_salary_detail` ADD CONSTRAINT `emp_salary_detail_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `employee`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emp_salary_detail` ADD CONSTRAINT `emp_salary_detail_joiningFormId_fkey` FOREIGN KEY (`joiningFormId`) REFERENCES `joining_form`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
