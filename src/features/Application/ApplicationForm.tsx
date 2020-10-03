import React, { useState, useEffect } from 'react';
import { AxiosResponse } from 'axios';
import {
  ErrorMessage,
  FastField,
  Field,
  Formik,
  FormikProps,
  FormikValues,
} from 'formik';
import { toast } from 'react-toastify';

import * as CONSTANTS from '../../config/constants';
import { getOptionsFromEnum } from '../../util';
import getValidationSchema from './validationSchema';

import {
  Degrees,
  FrontendRoute,
  HackerStatus,
  IEthnicity,
  IHacker,
  JobInterest,
  Majors,
  ShirtSize,
  Skills,
} from '../../config';

import { Form, SubmitBtn } from '../../shared/Form';
import * as FormikElements from '../../shared/Form/FormikElements';

import { Account, APIResponse, Hacker } from '../../api';

import ValidationErrorGenerator from '../../shared/Form/validationErrorGenerator';

import ResumeComponent from './ResumeComponent';
import SchoolComponent from './SchoolComponent';

import { Flex } from '@rebass/grid';
import { ResetBtn } from '../../shared/Form/ResetBtn';
import WithToasterContainer from '../../shared/HOC/withToaster';
import { useHistory } from 'react-router-dom';

/**
 * Form that allows hacker to fill out their application
 */

const ApplicationForm: React.FC = (props) => {
  // Get access to router history in order to programatically change page
  const history = useHistory();

  // Is hacker's application data still loading?
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  // Has this hacker already submitted an application
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  // Are we waiting for server to finish processing submission of application?
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Current page of the applciation that's visible
  const [pageNumber, setPageNumber] = useState<number>(1)

  // Hacker's application data
  const [hackerDetails, setHackerDetails] = useState<IHacker>({
    id: '',
    accountId: '',
    status: HackerStatus.HACKER_STATUS_NONE,
    application: {
      general: {
        school: '',
        degree: '',
        fieldOfStudy: '',
        graduationYear: NaN,
        jobInterest: '',
        URL: {
          resume: '',
          github: '',
          dribbble: '',
          linkedIn: '',
          personal: '',
          other: '',
        },
      },
      shortAnswer: {
        skills: [],
        question1: '',
        question2: '',
        comments: '',
      },
      other: {
        ethnicity: [],
        privacyPolicy: false,
        codeOfConduct: false,
      },
      accommodation: {
        shirtSize: '',
        impairments: '',
        barriers: '',
        travel: 0,
      },
    },
  })

  // Hacker's resume
  const [resume, setResume] = useState<File | null>(null);

  // When this component mounts, fetch hacker's saved appliation data if it already exists
  useEffect(() => {
    (async () => {
      try {
        const response = await Hacker.getSelf();
        const hackerDetails = response.data.data;
        setHackerDetails(hackerDetails);
      } catch (e) {
        // If failed, probably because hacker hasn't created application before
      }

      // Hacker data has been loaded, record that loading is finished
      setIsLoaded(true);
    })();
  }, []);

  // If application creation deadline of Jan 3, 2020 11:59:59PM EST has passed or form is submitted, return user to the home page
  if (Date.now() > CONSTANTS.APPLICATION_CLOSE_TIME || isSubmitted) {
    history.push(FrontendRoute.HOME_PAGE)
  }

  /**
   * The function to pass into the formik component to render the form.
   * @param fp the formik props.
   */
  const renderFormik = (fp: FormikProps<any>) => {
    switch (fp.values.pageNumber) {
      case 2:
        return renderShortAnswerFormik(fp);
      case 3:
        return renderAccommodationFormik(fp);
      case 4:
        return renderOtherFormik(fp);
      default:
        return renderGeneralFormik(fp);
    }
  }

  /**
  * Renders the general section of the application.
  * @param fp the formik props.
  */
  const renderGeneralFormik = (fp: FormikProps<any>) => (
    <Form onKeyDown={onKeyDown} onSubmit={fp.handleSubmit}>
      <FastField
        id="schoolName"
        name={'hacker.application.general.school'}
        component={SchoolComponent}
        value={fp.values.hacker.application.general.school}
        required={true}
        label={CONSTANTS.SCHOOL_LABEL}
        placeholder={CONSTANTS.SCHOOL_PLACEHOLDER}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.general.school"
      />
      <FastField
        name={'hacker.application.general.degree'}
        label={CONSTANTS.DEGREE_LABEL}
        placeholder={CONSTANTS.DEGREE_PLACEHOLDER}
        creatable={true}
        options={getOptionsFromEnum(Degrees)}
        component={FormikElements.Select}
        value={fp.values.hacker.application.general.degree}
        required={true}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.general.degree"
      />
      <FastField
        name={'hacker.application.general.graduationYear'}
        label={CONSTANTS.GRADUATION_YEAR_LABEL}
        placeholder="YYYY"
        format="####"
        component={FormikElements.FormattedNumber}
        value={fp.values.hacker.application.general.graduationYear}
        required={true}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.general.graduationYear"
      />
      <FastField
        name={'hacker.application.general.fieldOfStudy'}
        options={Majors}
        isMulti={true}
        creatable={true}
        component={FormikElements.Select}
        label={CONSTANTS.FIELD_OF_STUDY_LABEL}
        placeholder={CONSTANTS.FIELD_OF_STUDY_PLACEHOLDER}
        value={fp.values.hacker.application.general.fieldOfStudy}
        required={true}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.general.fieldOfStudy"
      />
      <FastField
        name={'hacker.application.general.URL.github'}
        inputType="url"
        component={FormikElements.Input}
        label={CONSTANTS.GITHUB_LINK_LABEL}
        placeholder={CONSTANTS.GITHUB_LINK_PLACEHOLDER}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.general.URL.github"
      />

      <FastField
        name={'hacker.application.general.URL.dribbble'}
        inputType="url"
        component={FormikElements.Input}
        label={CONSTANTS.DRIBBBLE_LINK_LABEL}
        placeholder={CONSTANTS.DRIBBBLE_LINK_PLACEHOLDER}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.general.URL.dribbble"
      />
      <FastField
        name={'hacker.application.general.URL.linkedIn'}
        inputType="url"
        component={FormikElements.Input}
        label={CONSTANTS.LINKEDIN_LINK_LABEL}
        placeholder={CONSTANTS.LINKEDIN_LINK_PLACEHOLDER}
        value={fp.values.hacker.application.general.URL.linkedIn}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.general.URL.linkedIn"
      />
      <FastField
        name={'hacker.application.general.URL.other'}
        inputType="url"
        component={FormikElements.Input}
        label={CONSTANTS.OTHER_LINK_LABEL}
        placeholder={CONSTANTS.OTHER_LINK_PLACEHOLDER}
        value={fp.values.hacker.application.general.URL.other}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.general.URL.other"
      />
      <Field
        name="resume" // TODO: Fix when new application workflow is implemented
        component={ResumeComponent}
        label={CONSTANTS.RESUME_LABEL}
        hackerId={hackerDetails.id}
        required={true}
        value={fp.values.resume}
      />
      <ErrorMessage component={FormikElements.Error} name="resume" />
      <FastField
        name={'hacker.application.general.jobInterest'}
        component={FormikElements.Select}
        options={getOptionsFromEnum(JobInterest)}
        label={CONSTANTS.JOBINTEREST_LABEL}
        placeholder={CONSTANTS.JOBINTEREST_PLACEHOLDER}
        value={fp.values.hacker.application.general.jobInterest}
        required={true}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.general.jobInterest"
      />
      <SubmitBtn
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        Next
      </SubmitBtn>
    </Form>
  );

  /**
   * Renders the short answer section of the application.
   * @param fp the formik props.
   */
  const renderShortAnswerFormik = (fp: FormikProps<any>) => (
    <Form
      onKeyDown={onKeyDown}
      onSubmit={fp.handleSubmit}
      onReset={fp.handleReset}
    >
      <FastField
        name={'hacker.application.shortAnswer.skills'}
        isMulti={true}
        creatable={true}
        options={getOptionsFromEnum(Skills)}
        label={CONSTANTS.SKILLS_LABEL}
        placeholder={CONSTANTS.SKILLS_PLACEHOLDER}
        component={FormikElements.Select}
        value={fp.values.hacker.application.shortAnswer.skills}
      />
      <FastField
        name={'hacker.application.shortAnswer.question1'}
        component={FormikElements.LongTextInput}
        label={CONSTANTS.QUESTION1_REQUEST_LABEL}
        value={fp.values.hacker.application.shortAnswer.question1}
        maxLength={2000}
        required={true}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.shortAnswer.question1"
      />
      <FastField
        name={'hacker.application.shortAnswer.question2'}
        component={FormikElements.LongTextInput}
        label={CONSTANTS.QUESTION2_REQUEST_LABEL}
        value={fp.values.hacker.application.shortAnswer.question2}
        maxLength={2000}
        required={true}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.shortAnswer.question2"
      />
      <FastField
        name={'hacker.application.shortAnswer.comments'}
        component={FormikElements.LongTextInput}
        label={CONSTANTS.COMMENTS_LABEL}
        value={fp.values.hacker.application.shortAnswer.comments}
        maxLength={500}
        required={false}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.shortAnswer.comments"
      />
      <Flex
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        {/* Add for spacing purposes */}
        <div>&nbsp;</div>
        <ResetBtn
          isLoading={false}
          disabled={isSubmitting}
          variant={2}
        >
          Back
        </ResetBtn>

        <SubmitBtn
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Next
        </SubmitBtn>
        <div>&nbsp;</div>
      </Flex>
    </Form>
  );

  /**
   * Renders the accommodation section of the application.
   * @param fp the formik props.
   */
  const renderAccommodationFormik = (fp: FormikProps<any>) => (
    <Form
      onKeyDown={onKeyDown}
      onSubmit={fp.handleSubmit}
      onReset={fp.handleReset}
    >
      <FastField
        name={'hacker.application.accommodation.shirtSize'}
        label={CONSTANTS.SHIRT_SIZE_LABEL}
        component={FormikElements.Select}
        options={getOptionsFromEnum(ShirtSize)}
        required={true}
        value={fp.values.hacker.application.accommodation.shirtSize}
      />
      <ErrorMessage
        name={'hacker.application.accommodation.shirtSize'}
        component={FormikElements.Error}
      />
      {/* This fixes the issue with going back somehow, so leave it here temporarily */}
      <div />
      <FastField
        name={'hacker.application.accommodation.impairments'}
        component={FormikElements.LongTextInput}
        label={CONSTANTS.IMPAIRMENTS_LABEL}
        value={fp.values.hacker.application.accommodation.impairments}
        required={false}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name={'hacker.application.accommodation.impairments'}
      />
      <FastField
        name={'hacker.application.accommodation.barriers'}
        component={FormikElements.LongTextInput}
        label={CONSTANTS.BARRIERS_LABEL}
        value={fp.values.hacker.application.accommodation.barriers}
        required={false}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name={'hacker.application.accommodation.barriers'}
      />
      <FastField
        name={'hacker.application.accommodation.travel'}
        component={FormikElements.FormattedNumber}
        label={CONSTANTS.TRAVEL_REQUEST_LABEL}
        placeholder={0}
        required={false}
        value={fp.values.hacker.application.accommodation.travel}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name={'hacker.application.accommodation.travel'}
      />
      <Flex
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <div>&nbsp;</div>
        <ResetBtn
          isLoading={false}
          disabled={isSubmitting}
          variant={2}
        >
          Back
        </ResetBtn>
        <SubmitBtn
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Next
        </SubmitBtn>
        <div>&nbsp;</div>
      </Flex>
    </Form >
  );

  /**
   * Renders the other section of the application
   * @param fp the formik props.
   */
  const renderOtherFormik = (fp: FormikProps<any>) => (
    <Form
      onKeyDown={onKeyDown}
      onSubmit={fp.handleSubmit}
      onReset={fp.handleReset}
    >
      <FastField
        name={'hacker.application.other.ethnicity'}
        isMulti={true}
        creatable={true}
        options={getOptionsFromEnum(IEthnicity)}
        label={CONSTANTS.ETHNICITY_LABEL}
        placeholder={CONSTANTS.ETHNICITY_PLACEHOLDER}
        component={FormikElements.Select}
        value={fp.values.hacker.application.other.ethnicity}
        required={true}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.other.ethnicity"
      />
      <FastField
        name={'hacker.application.other.codeOfConduct'}
        component={FormikElements.Checkbox}
        label={
          <span>
            {CONSTANTS.COC_ACCEPTANCE_PHRASE}
            {' McHacks '}
            <a
              href="https://mchacks.ca/code-of-conduct"
              target="_blank"
              rel="noopener noreferrer"
            >
              {CONSTANTS.MCHACKS_COC}
            </a>
            {' and '}
            <a
              href="https://mchacks.ca/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              {CONSTANTS.MCHACKS_PRIVACY}
            </a>
          </span>
        }
        value={fp.values.hacker.application.other.codeOfConduct}
        required={true}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.other.codeOfConduct"
      />
      <FastField
        name={'hacker.application.other.privacyPolicy'}
        component={FormikElements.Checkbox}
        label={CONSTANTS.MLH_LABEL}
        subtitle={
          <span>
            {'I have read and agree to the '}
            <a
              href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              {'MLH Code of Conduct'}
            </a>
            {'. '}
            {
              'I authorize you to share my application/registration information for event administration, ranking, MLH administration, pre- and post-event informational e-mails, and occasional messages about hackathons in-line with the '
            }
            <a
              href="https://mlh.io/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              {'MLH Privacy Policy'}
            </a>
            {'. I further agree to the terms of both the '}
            <a
              href="https://github.com/MLH/mlh-policies/blob/master/prize-terms-and-conditions/contest-terms.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              {'MLH Contest Terms and Conditions'}
            </a>
            {' and the '}
            <a
              href="https://mlh.io/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              {'MLH Privacy Policy'}
              {'.'}
            </a>
          </span>
        }
        value={fp.values.hacker.application.other.privacyPolicy}
        required={true}
      />
      <ErrorMessage
        component={FormikElements.Error}
        name="hacker.application.other.privacyPolicy"
      />
      <Flex
        flexDirection={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <div>&nbsp;</div>
        <ResetBtn
          isLoading={false}
          disabled={isSubmitting}
          variant={2}
        >
          Back
          </ResetBtn>
        <SubmitBtn
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Submit
        </SubmitBtn>
        <div>&nbsp;</div>
      </Flex>
    </Form>
  );

  /**
   * Stop enter submitting the form.
   * @param keyEvent Event triggered when the user presses a key.
   */
  const onKeyDown = (keyEvent: any) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  /**
   * Event handler to go the previous section of the application, while also saving values on the current section.
   * @param values The formik values
   */
  const previousPage = (values: any) => {
    let app;
    if (values.hacker.id && values.hacker.accountId) {
      app = convertFormikToHacker(
        values,
        values.hacker.accountId,
        values.hacker.id
      );
    } else if (values.hacker.accountId) {
      app = convertFormikToHacker(values, values.hacker.accountId);
    } else {
      app = convertFormikToHacker(values);
    }
    setPageNumber(values.pageNumber - 1);
    setHackerDetails(app);
    setResume(resume ? resume : values.resume);
  }

  /**
   * Event handler to go the next section of the application, while also saving values on the current section.
   * @param values The formik values
   */
  const nextPage = (values: any) => {
    let app;
    if (values.hacker.id && values.hacker.accountId) {
      app = convertFormikToHacker(
        values,
        values.hacker.accountId,
        values.hacker.id
      );
    } else if (values.hacker.accountId) {
      app = convertFormikToHacker(values, values.hacker.accountId);
    } else {
      app = convertFormikToHacker(values);
    }
    setPageNumber(values.pageNumber + 1);
    setHackerDetails(app);
    setResume(resume ? resume : values.resume);
  }

  /**
 * Function called when formik form is submitted.
 * @param values the formik values
 * @param actions the formik actions
 */
  const handleSubmit = (values: any) => {
    if (values.pageNumber !== 4) {
      nextPage(values);
    } else {
      setIsSubmitting(true);
      handleCreate(values)
        .then((success: boolean) => {
          if (success) {
            console.log('Submitted application');
            toast.success(
              `Account created!'
              }`
            );
            setIsSubmitted(true);
            setIsSubmitting(false);
          } else {
            toast.error(`There was an error when submitting the application.`);
            setIsSubmitting(false);
          }
        })
        .catch((response: AxiosResponse<APIResponse<any>> | undefined) => {
          if (response) {
            ValidationErrorGenerator(response.data);
          }
          setIsSubmitting(false);
        });
    }
  }
  /**
   * Handles the creation of the application.
   * @param values the formik values
   * @param actions the formik actions
   */
  const handleCreate = async (values: any): Promise<boolean> => {
    const acctResponse = await Account.getSelf();

    if (acctResponse.status !== 200) {
      console.error('Error while getting current user');
      return false;
    }
    const account = acctResponse.data.data;
    const application = convertFormikToHacker(values, account.id);
    const hackerResponse = await Hacker.create(application);
    if (hackerResponse.status !== 200) {
      console.error('Error while creating application');
      return false;
    }
    const hacker = hackerResponse.data.data;
    const resumeResponse = await Hacker.uploadResume(hacker.id, values.resume);
    if (resumeResponse.status !== 200) {
      console.error('Could not upload resume properly');
      return false;
    } else {
      console.log('Uploaded application properly!');
    }
    return true;
  }
  /**
   * Handles the editing of the application.
   * @param values Formik values
   * @param actions Formik actions
   */
  const handleEdit = async (values: any): Promise<boolean> => {
    const acctResponse = await Account.getSelf();

    if (acctResponse.status !== 200) {
      console.error('Error while getting current user');
      return false;
    }

    const account = acctResponse.data.data;
    const hackerId = hackerDetails.id;
    // convert the formik values to the application object.
    const application = convertFormikToHacker(
      values,
      account.id,
      hackerId
    );
    const hackerResponse = await Hacker.update(application);

    if (hackerResponse.status !== 200) {
      console.error('Error while updating application');
      return false;
    }
    if (values.resume) {
      // only upload a resume if they have added a resume to the form.
      const resumeResponse = await Hacker.uploadResume(hackerId, values.resume);

      if (resumeResponse.status !== 200) {
        console.error('Could not upload resume properly');
        return false;
      } else {
        console.log('Uploaded application properly!');
      }
    }
    return true;
  }


  // Return rendered form, unless still loading
  if (!isLoaded) {
    return null;
  }
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        hacker: hackerDetails,
        resume: resume ? resume : undefined,
        pageNumber,
      }}
      onSubmit={handleSubmit}
      onReset={previousPage}
      render={renderFormik}
      validationSchema={getValidationSchema(
        true, // TODO: Assuming always creating new application, will have to fix this when new application workflow is implemented
        pageNumber
      )}
    />
  );
}

/**
   * This converts the formik values object into the IHacker object.
   * @param values Formik values
   * @param resumeLink the link to the resume. Used only when the hacker is updating their application.
   * @param hackerId the hacker id. Used only when the hacker is updating their application.
   * @param accountId the account id associated with this hacker.
   */
function convertFormikToHacker(
  values: FormikValues,
  accountId: string = '',
  hackerId: string = ''
): IHacker {
  return {
    id: hackerId,
    accountId,
    status: HackerStatus.HACKER_STATUS_NONE,
    application: values.hacker.application,
  };
}

export default WithToasterContainer(ApplicationForm);