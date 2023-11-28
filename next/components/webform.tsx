import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { useForm } from 'react-hook-form'

import { Webform } from '@/lib/zod/webform'
import { validateAndCleanupWebformSubmissionList } from '@/lib/zod/webform-submission-list'

import { AuthGate } from './auth-gate'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { StatusMessage } from '@/ui/status-message'

type FieldInputs = {
  first_name?: string
  last_name?: string
  username?: string
  email?: string
  phone?: string
  age?: number
  message?: string
  participant?: boolean
}

interface WebformProps {
  webform: Webform
  onlyForAuthenticated?: boolean
  formTitle: string
  formMessageIfUnauthenticated?: string
}

/**
 * Renders a web form component.
 *
 * @component
 * @param {Object} webform - The webform object.
 * @param {boolean} [onlyForAuthenticated=false] - Indicates if the form is only for authenticated users.
 * @param {string} [formTitle='events-form-title'] - The title of the form.
 * @returns {JSX.Element} The rendered web form component.
 */
export function Webform({
  webform,
  onlyForAuthenticated = false,
  formTitle = 'Form',
  formMessageIfUnauthenticated = 'Sign in to submit the form'
}: WebformProps) {
  const fieldInputs = Object.keys(webform.field_webform_fields).map(
    (key) => key
  )
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSubmissionsFetched, setIsSubmissionsFetched] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)

  const { t } = useTranslation()
  const { register, handleSubmit, reset, formState } = useForm<FieldInputs>()

  useEffect(() => {
    if (onlyForAuthenticated == false) {
      setIsSubmissionsFetched(true)
      setIsFormSubmitted(false)
    }
  }, [onlyForAuthenticated])

  useEffect(() => {
    if (onlyForAuthenticated && session && session.accessToken) {
      checkSubmissions().then((response) => {
        if (response && response.length > 0) {
          response.map((submission) => {
            if (
              submission.webform_id[0].target_id ===
              webform.resourceIdObjMeta.drupal_internal__target_id
            ) {
              setIsFormSubmitted(true)
            }
          })
        }
      })
      setIsSubmissionsFetched(true)
    }
  }, [session])

  const checkSubmissions = async () => {
    const response = await fetch(`/api/webform_submissions`, {
      method: 'POST',
      headers: {
        'accept-language': router.locale
      }
    }).then((response) => response.json())
    const validated = validateAndCleanupWebformSubmissionList(response)
    return validated
  }

  const onSubmit = async (data: FieldInputs) => {
    const response = await fetch(`/api/webform`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        webform_id: webform.resourceIdObjMeta.drupal_internal__target_id,
        onlyForAuth: onlyForAuthenticated
      }),
      headers: {
        'accept-language': router.locale
      }
    })

    if (!response.ok) {
      alert('Error!')
    }
  }

  const onErrors = (errors) => console.error(errors)

  if (status === 'loading') {
    return null
  }

  if (isFormSubmitted) {
    return <h2>You have already submitted this form</h2>
  }

  if (formState.isSubmitSuccessful) {
    setIsFormSubmitted(true)
    return (
      <StatusMessage level="success" className="mx-auto w-full max-w-3xl">
        <p className="mb-4">{t('form-thank-you-message')}</p>
        <Button type="button" onClick={() => reset()}>
          {t('form-send-another-message')}
        </Button>
      </StatusMessage>
    )
  }

  return (
    <AuthWrapper
      text={formMessageIfUnauthenticated}
      onlyForAuthenticated={onlyForAuthenticated}
    >
      <form
        onSubmit={handleSubmit(onSubmit, onErrors)}
        className="mx-auto mb-4 flex max-w-3xl flex-col gap-5 rounded border border-finnishwinter bg-white p-4 shadow-md transition-all hover:shadow-md"
      >
        <h2 className="text-heading-sm font-bold md:text-heading-md">
          {formTitle}
        </h2>
        {fieldInputs.map((key) => {
          return (
            <div key={key}>
              <Label htmlFor={webform.field_webform_fields[key]['#title']}>
                {t(
                  `form-label-${webform.field_webform_fields[key]['#title']
                    .toLowerCase()
                    .replace(' ', '')}`
                )}
              </Label>
              <Input
                type={webform.field_webform_fields[key]['#type']}
                id={webform.field_webform_fields[key]['#title']}
                {...register(key as keyof FieldInputs, {
                  required: webform.field_webform_fields[key]['#required'],
                  min: webform.field_webform_fields[key]['#min'],
                  max: webform.field_webform_fields[key]['#max']
                })}
              />
              {formState.errors[key] && <p>{formState.errors[key].message}</p>}
            </div>
          )
        })}
        <Button disabled={!formState.isValid} type="submit">
          {t('form-label-submit')}
        </Button>
      </form>
    </AuthWrapper>
  )
}

type AuthWrapperProps = {
  text: string
  children: React.ReactNode
  onlyForAuthenticated?: boolean
}

const AuthWrapper = ({
  text,
  children,
  onlyForAuthenticated
}: AuthWrapperProps) => {
  if (onlyForAuthenticated) {
    return <AuthGate text={text}>{children}</AuthGate>
  }
  return <Fragment>{children}</Fragment>
}

